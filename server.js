import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { isAllowedDomain, filterResults, ALL_ALLOWED_DOMAINS } from './whitelist.js';

const app = express();
app.use(cors());
app.use(express.json());

let browser = null;

console.log(`📋 Whitelist loaded: ${ALL_ALLOWED_DOMAINS.size} domains authorized`);

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });
  }
  return browser;
}

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Atlas Search Backend',
    whitelistedDomains: ALL_ALLOWED_DOMAINS.size,
    version: '2.0.0'
  });
});

// Get whitelist info
app.get('/whitelist', (req, res) => {
  res.json({
    totalDomains: ALL_ALLOWED_DOMAINS.size,
    domains: Array.from(ALL_ALLOWED_DOMAINS).sort()
  });
});

// Check if domain is allowed
app.get('/check/:domain', (req, res) => {
  const domain = req.params.domain;
  const allowed = isAllowedDomain('https://' + domain);
  res.json({ domain, allowed });
});

// Web Search
app.post('/search', async (req, res) => {
  const { query, maxResults = 10, forceDate = true, countries = [] } = req.body;
  
  // Ajouter la date du jour pour forcer les résultats récents
  const today = new Date();
  const year = today.getFullYear();
  const month = today.toLocaleString('fr-FR', { month: 'long' });
  const dateQuery = forceDate ? ` ${year}` : '';
  
  // Multi-pays : si plusieurs pays, on les ajoute à la requête
  const countryQuery = countries.length > 0 ? ` ${countries.join(' OR ')}` : '';
  
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }
  
  const fullQuery = query + dateQuery + countryQuery;
  console.log('🔍 Searching:', fullQuery, `(date: ${year}, countries: ${countries.length || 'all'})`);
  
  try {
    const b = await getBrowser();
    const page = await b.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });
    
    // DuckDuckGo Search (more permissive)
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(fullQuery)}&t=h_&ia=web`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for results to load
    await page.waitForSelector('[data-testid="result"]', { timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000)); // Extra wait for JS
    
    // Extract results
    const results = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('[data-testid="result"]').forEach((el) => {
        const link = el.querySelector('a[data-testid="result-title-a"]');
        const snippet = el.querySelector('[data-result="snippet"]');
        
        if (link && link.href && link.href.startsWith('http')) {
          items.push({
            title: link.textContent || '',
            url: link.href,
            snippet: snippet ? snippet.textContent : '',
            source: new URL(link.href).hostname.replace('www.', '')
          });
        }
      });
      return items;
    });
    
    await page.close();
    
    // Filter to only allowed domains
    const filteredResults = filterResults(results);
    
    console.log(`✅ Found ${results.length} results, ${filteredResults.length} from authorized sources`);
    res.json({ 
      results: filteredResults.slice(0, maxResults), 
      count: filteredResults.length,
      totalFound: results.length 
    });
    
  } catch (error) {
    console.error('❌ Search error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Extract page content
app.post('/extract', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  // Check if domain is allowed
  if (!isAllowedDomain(url)) {
    console.log('⛔ Blocked domain:', url);
    return res.status(403).json({ error: 'Domain not in whitelist' });
  }
  
  console.log('📄 Extracting:', url);
  
  try {
    const b = await getBrowser();
    const page = await b.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    });
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Wait for Cloudflare challenge if present
    const isCloudflare = await page.evaluate(() => 
      document.title.includes('Just a moment') || 
      document.body.innerText.includes('Checking your browser')
    );
    
    if (isCloudflare) {
      console.log('⏳ Cloudflare detected, waiting...');
      await new Promise(r => setTimeout(r, 5000));
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    }
    
    const data = await page.evaluate(() => {
      // Extract date from page
      let date = null;
      
      // Try meta tags
      const metaDate = document.querySelector('meta[property="article:published_time"], meta[name="date"], meta[name="DC.date"], meta[property="og:updated_time"], meta[name="last-modified"]');
      if (metaDate) date = metaDate.getAttribute('content');
      
      // Try time elements
      if (!date) {
        const timeEl = document.querySelector('time[datetime], time[pubdate]');
        if (timeEl) date = timeEl.getAttribute('datetime') || timeEl.textContent;
      }
      
      // Try common date patterns in text
      if (!date) {
        const datePatterns = [
          /(?:publié|modifié|mis à jour|updated|published|date)[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
          /(?:publié|modifié|mis à jour|updated|published|date)[:\s]*(\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4})/i,
          /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/,
          /(\d{4}[\/-]\d{1,2}[\/-]\d{1,2})/,
        ];
        const bodyText = document.body.innerText.substring(0, 5000);
        for (const pattern of datePatterns) {
          const match = bodyText.match(pattern);
          if (match) {
            date = match[1];
            break;
          }
        }
      }
      
      // Remove unwanted elements
      document.querySelectorAll('script, style, nav, footer, header, aside, iframe').forEach(el => el.remove());
      
      const title = document.title || '';
      const main = document.querySelector('main, article, .content, #content, .post-content') || document.body;
      const content = main.textContent.replace(/\s+/g, ' ').trim().substring(0, 15000);
      
      return { title, content, date };
    });
    
    await page.close();
    
    console.log(`✅ Extracted: ${data.title.substring(0, 50)}... | Date: ${data.date || 'non trouvée'}`);
    res.json({ 
      url, 
      title: data.title, 
      content: data.content,
      date: data.date,
      extractedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Extract error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// MULTI-COUNTRY PARALLEL SEARCH
// ============================================================================

app.post('/search-multi', async (req, res) => {
  const { query, countries = [], maxResultsPerCountry = 5 } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }
  
  if (!countries.length) {
    return res.status(400).json({ error: 'Countries array required' });
  }
  
  const year = new Date().getFullYear();
  console.log(`🌍 Multi-country search: "${query}" in ${countries.length} countries (${year})`);
  
  try {
    // Recherche parallèle pour chaque pays
    const searchPromises = countries.map(async (country) => {
      const countryQuery = `${query} ${country} ${year}`;
      
      const b = await getBrowser();
      const page = await b.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(countryQuery)}&t=h_&ia=web`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      await page.waitForSelector('[data-testid="result"]', { timeout: 10000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 1500));
      
      const results = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('[data-testid="result"]').forEach((el) => {
          const link = el.querySelector('a[href]');
          const title = el.querySelector('h2');
          const snippet = el.querySelector('[data-result="snippet"]');
          
          if (link && title) {
            items.push({
              title: title.textContent?.trim() || '',
              url: link.href,
              snippet: snippet?.textContent?.trim() || '',
            });
          }
        });
        return items;
      });
      
      await page.close();
      
      // Filtrer par whitelist
      const filtered = filterResults(results).slice(0, maxResultsPerCountry);
      
      return {
        country,
        results: filtered.map(r => ({ ...r, country })),
        count: filtered.length
      };
    });
    
    const allResults = await Promise.all(searchPromises);
    
    // Agréger les résultats
    const aggregated = {
      query,
      year,
      countries: allResults,
      totalResults: allResults.reduce((sum, c) => sum + c.count, 0),
      searchedAt: new Date().toISOString()
    };
    
    console.log(`✅ Multi-search complete: ${aggregated.totalResults} results from ${countries.length} countries`);
    res.json(aggregated);
    
  } catch (error) {
    console.error('❌ Multi-search error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// PDF EXTRACTION (OCR pour BOFiP, circulaires, etc.)
// ============================================================================

app.post('/extract-pdf', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  if (!isAllowedDomain(url)) {
    return res.status(403).json({ error: 'Domain not in whitelist' });
  }
  
  console.log('📑 Extracting PDF:', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch PDF');
    
    const buffer = await response.arrayBuffer();
    const data = await pdf(Buffer.from(buffer));
    
    // Extract structured content
    const content = data.text;
    const numPages = data.numpages;
    
    // Try to extract date from PDF metadata or content
    let date = null;
    const datePatterns = [
      /(?:du|en date du|publié le)\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i,
      /(\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4})/i,
    ];
    for (const pattern of datePatterns) {
      const match = content.match(pattern);
      if (match) {
        date = match[1];
        break;
      }
    }
    
    console.log(`✅ PDF extracted: ${numPages} pages, date: ${date || 'non trouvée'}`);
    
    res.json({
      url,
      content: content.substring(0, 50000),
      numPages,
      date,
      extractedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ PDF extraction error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// STRUCTURED LAW PARSING (Articles, alinéas, références)
// ============================================================================

app.post('/parse-law', async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  console.log('⚖️ Parsing law structure...');
  
  try {
    // Extract article numbers
    const articlePattern = /(?:Article|Art\.?)\s*(\d+(?:[.-]\d+)*(?:\s*[a-zA-Z])?)/gi;
    const articles = [...content.matchAll(articlePattern)].map(m => m[1]);
    
    // Extract alinéas
    const alineaPattern = /(?:alinéa|al\.?)\s*(\d+)/gi;
    const alineas = [...content.matchAll(alineaPattern)].map(m => m[1]);
    
    // Extract references to other articles
    const refPattern = /(?:article|art\.?)\s*(\d+(?:[.-]\d+)*)\s*(?:du|de la|de l')\s*(CGI|Code général des impôts|LPF|Livre des procédures fiscales|Code de commerce|Code civil)/gi;
    const references = [...content.matchAll(refPattern)].map(m => ({
      article: m[1],
      code: m[2]
    }));
    
    // Extract law codes mentioned
    const codePattern = /(CGI|LPF|Code général des impôts|Livre des procédures fiscales|Code de commerce|Code civil|Code du travail|Code monétaire et financier)/gi;
    const codes = [...new Set([...content.matchAll(codePattern)].map(m => m[1]))];
    
    // Extract dates mentioned
    const datePattern = /(\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4})/gi;
    const dates = [...new Set([...content.matchAll(datePattern)].map(m => m[1]))];
    
    // Extract monetary amounts
    const amountPattern = /(\d[\d\s]*(?:,\d+)?\s*(?:€|euros?|EUR))/gi;
    const amounts = [...content.matchAll(amountPattern)].map(m => m[1].trim());
    
    // Extract percentages (tax rates)
    const ratePattern = /(\d+(?:[.,]\d+)?\s*%)/g;
    const rates = [...new Set([...content.matchAll(ratePattern)].map(m => m[1]))];
    
    res.json({
      articles: [...new Set(articles)],
      alineas: [...new Set(alineas)],
      references,
      codes,
      dates,
      amounts: [...new Set(amounts)].slice(0, 20),
      rates,
      structure: {
        hasArticles: articles.length > 0,
        hasReferences: references.length > 0,
        articleCount: new Set(articles).size,
        referenceCount: references.length
      }
    });
    
  } catch (error) {
    console.error('❌ Parse error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// JURISPRUDENCE SEARCH (Décisions de justice)
// ============================================================================

app.post('/search-jurisprudence', async (req, res) => {
  const { query, maxResults = 10 } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }
  
  console.log('⚖️ Searching jurisprudence:', query);
  
  try {
    const b = await getBrowser();
    const page = await b.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Search on Légifrance jurisprudence
    const searchUrl = `https://www.legifrance.gouv.fr/search/juri?tab_selection=juri&searchField=ALL&query=${encodeURIComponent(query)}&searchType=ALL`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('.result-item, .search-result', { timeout: 10000 }).catch(() => {});
    
    const results = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.result-item, .search-result, article').forEach((el) => {
        const link = el.querySelector('a');
        const title = el.querySelector('h3, .title, strong');
        const date = el.querySelector('.date, time, .meta');
        const court = el.querySelector('.court, .juridiction, .source');
        
        if (link && title) {
          items.push({
            title: title.textContent?.trim() || '',
            url: link.href,
            date: date?.textContent?.trim() || null,
            court: court?.textContent?.trim() || null,
            type: 'jurisprudence'
          });
        }
      });
      return items;
    });
    
    await page.close();
    
    console.log(`✅ Found ${results.length} jurisprudence results`);
    res.json({ results: results.slice(0, maxResults), count: results.length });
    
  } catch (error) {
    console.error('❌ Jurisprudence search error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// MULTI-QUERY GENERATION (Reformulation intelligente)
// ============================================================================

app.post('/generate-queries', async (req, res) => {
  const { question, count = 5 } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question required' });
  }
  
  console.log('🧠 Generating query variants for:', question);
  
  // Generate variants locally (no external API needed)
  const variants = [];
  
  // Original
  variants.push(question);
  
  // Add "France" if not present
  if (!question.toLowerCase().includes('france')) {
    variants.push(question + ' France');
  }
  
  // Add legal terms
  const legalTerms = ['CGI', 'article', 'loi', 'décret', 'BOFiP', 'jurisprudence'];
  for (const term of legalTerms) {
    if (!question.toLowerCase().includes(term.toLowerCase())) {
      variants.push(question + ' ' + term);
      if (variants.length >= count) break;
    }
  }
  
  // Add year
  const currentYear = new Date().getFullYear();
  if (!question.includes(String(currentYear))) {
    variants.push(question + ' ' + currentYear);
  }
  
  // Add "taux" for tax questions
  if (question.toLowerCase().includes('impôt') || question.toLowerCase().includes('taxe')) {
    variants.push(question + ' taux applicable');
  }
  
  // Synonyms
  const synonyms = {
    'impôt': 'fiscalité',
    'taxe': 'imposition',
    'société': 'entreprise',
    'revenu': 'bénéfice',
  };
  
  for (const [word, synonym] of Object.entries(synonyms)) {
    if (question.toLowerCase().includes(word)) {
      variants.push(question.replace(new RegExp(word, 'gi'), synonym));
    }
  }
  
  const uniqueVariants = [...new Set(variants)].slice(0, count);
  
  console.log(`✅ Generated ${uniqueVariants.length} query variants`);
  res.json({ queries: uniqueVariants });
});

// ============================================================================
// CROSS-REFERENCE & CONTRADICTION DETECTION
// ============================================================================

app.post('/analyze-sources', async (req, res) => {
  const { sources } = req.body;
  
  if (!sources || !Array.isArray(sources)) {
    return res.status(400).json({ error: 'Sources array required' });
  }
  
  console.log('🔍 Analyzing', sources.length, 'sources for contradictions...');
  
  try {
    const analysis = {
      totalSources: sources.length,
      datedSources: 0,
      recentSources: 0,
      rates: {},
      amounts: {},
      dates: [],
      contradictions: [],
      crossReferences: []
    };
    
    const now = new Date();
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
    
    for (const source of sources) {
      // Check dates
      if (source.date) {
        analysis.datedSources++;
        const sourceDate = new Date(source.date);
        if (sourceDate >= oneYearAgo) {
          analysis.recentSources++;
        }
        analysis.dates.push({ source: source.title, date: source.date });
      }
      
      // Extract rates from content
      if (source.content) {
        const ratePattern = /(\d+(?:[.,]\d+)?)\s*%/g;
        const rates = [...source.content.matchAll(ratePattern)];
        for (const rate of rates) {
          const rateValue = rate[1];
          if (!analysis.rates[rateValue]) {
            analysis.rates[rateValue] = [];
          }
          analysis.rates[rateValue].push(source.title);
        }
      }
    }
    
    // Detect contradictions (different rates for same thing)
    for (const [rate, sourceTitles] of Object.entries(analysis.rates)) {
      if (sourceTitles.length > 1) {
        // Check if other rates exist
        const otherRates = Object.keys(analysis.rates).filter(r => r !== rate);
        for (const otherRate of otherRates) {
          const otherSources = analysis.rates[otherRate];
          // If sources mention different rates, flag potential contradiction
          const overlap = sourceTitles.some(s => otherSources.includes(s));
          if (!overlap && Math.abs(parseFloat(rate) - parseFloat(otherRate)) > 1) {
            analysis.contradictions.push({
              type: 'rate_difference',
              values: [rate + '%', otherRate + '%'],
              sources: [sourceTitles[0], otherSources[0]],
              warning: `Taux différents trouvés: ${rate}% vs ${otherRate}%`
            });
          }
        }
      }
    }
    
    console.log(`✅ Analysis complete: ${analysis.contradictions.length} potential contradictions`);
    res.json(analysis);
    
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ENDPOINT UNIFIÉ /ask - Fait tout en un seul appel
// ============================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });
  
  console.log('\n🤖 ATLAS /ask - Question:', question);
  const startTime = Date.now();
  
  try {
    const year = new Date().getFullYear();
    const b = await getBrowser();
    
    // PHASE 1: Recherches PARALLÈLES (plusieurs requêtes en même temps)
    console.log('🔍 Phase 1: Recherches parallèles...');
    
    // Extraire les mots-clés fiscaux de la question
    const fiscalKeywords = [
      'prix de transfert', 'transfer pricing',
      'retenue à la source', 'withholding tax',
      'établissement stable', 'permanent establishment',
      'ATAD', 'anti-abus',
      'dividendes', 'holding',
      'convention fiscale', 'double imposition'
    ];
    
    // Générer des requêtes ciblées
    const queries = [`${question.substring(0, 100)} ${year}`];
    
    // Ajouter des requêtes pour chaque mot-clé trouvé
    for (const kw of fiscalKeywords) {
      if (question.toLowerCase().includes(kw.split(' ')[0])) {
        queries.push(`${kw} France Allemagne ${year}`);
      }
    }
    
    // Limiter à 4 requêtes max
    const limitedQueries = queries.slice(0, 4);
    console.log(`   📝 ${limitedQueries.length} requêtes générées`);
    
    // Fonction de recherche
    const searchQuery = async (query) => {
      const page = await b.newPage();
      try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });
        
        const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&ia=web`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 20000 });
        await page.waitForSelector('[data-testid="result"]', { timeout: 10000 }).catch(() => {});
        await new Promise(r => setTimeout(r, 1500));
        
        const results = await page.evaluate(() => {
          const items = [];
          document.querySelectorAll('[data-testid="result"]').forEach((el) => {
            const link = el.querySelector('a[data-testid="result-title-a"]');
            const snippet = el.querySelector('[data-result="snippet"]');
            if (link?.href?.startsWith('http')) {
              items.push({
                title: link.textContent || '',
                url: link.href,
                snippet: snippet?.textContent || '',
                source: new URL(link.href).hostname.replace('www.', '')
              });
            }
          });
          return items;
        });
        
        await page.close();
        return results;
      } catch (e) {
        await page.close().catch(() => {});
        return [];
      }
    };
    
    // Lancer toutes les recherches en parallèle
    const searchResults = await Promise.all(limitedQueries.map(searchQuery));
    const allResults = searchResults.flat();
    
    // Filtrer whitelist et dédupliquer
    const filtered = filterResults(allResults);
    const unique = filtered.slice(0, 8);
    console.log(`   📊 ${allResults.length} bruts → ${filtered.length} whitelist → ${unique.length} uniques`);
    
    // PHASE 2: Extraction PARALLÈLE (toutes les pages en même temps)
    console.log('🔍 Phase 2: Extraction parallèle...');
    
    const extractPage = async (result) => {
      const page = await b.newPage();
      try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        await page.goto(result.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        const data = await page.evaluate(() => {
          let date = null;
          const metaDate = document.querySelector('meta[property="article:published_time"], meta[name="date"]');
          if (metaDate) date = metaDate.getAttribute('content');
          if (!date) {
            const timeEl = document.querySelector('time[datetime]');
            if (timeEl) date = timeEl.getAttribute('datetime');
          }
          
          document.querySelectorAll('script, style, nav, footer, header, aside').forEach(el => el.remove());
          const main = document.querySelector('main, article, .content') || document.body;
          const content = main.textContent.replace(/\s+/g, ' ').trim().substring(0, 8000);
          
          return { title: document.title, content, date };
        });
        
        await page.close();
        
        if (!data.title.includes('Just a moment') && data.content.length > 300) {
          return {
            title: data.title,
            url: result.url,
            source: result.source,
            date: data.date,
            content: data.content,
            isRecent: data.date && new Date(data.date) > new Date(Date.now() - 365*24*60*60*1000)
          };
        }
      } catch (e) {
        await page.close().catch(() => {});
      }
      return null;
    };
    
    // Lancer toutes les extractions en parallèle
    const extractResults = await Promise.all(unique.map(extractPage));
    const sources = extractResults.filter(Boolean);
    console.log(`   ✅ ${sources.length}/${unique.length} pages extraites en parallèle`);
    
    if (sources.length === 0) {
      return res.json({
        answer: "❌ Aucune source officielle trouvée pour cette question.",
        sources: [],
        confidence: 'low'
      });
    }
    
    // PHASE 3: Synthèse Groq
    console.log('🔍 Phase 3: Groq...');
    
    const context = sources.map((s, i) => 
      `[Source ${i+1}: ${s.title}] (${s.date || 'date inconnue'})\n${s.url}\n${s.content.substring(0, 2500)}`
    ).join('\n\n---\n\n');
    
    const prompt = `Tu es un EXPERT FISCAL de haut niveau, spécialisé en droit fiscal français et international.

EXPERTISE:
- Fiscalité des entreprises (IS, TVA, CET, taxes diverses)
- Fiscalité des particuliers (IR, IFI, plus-values, successions)
- Fiscalité internationale (conventions fiscales, prix de transfert, établissements stables)
- Optimisation fiscale légale et structuration patrimoniale

RÈGLES STRICTES:
1. CITE TOUJOURS tes sources avec [Source X] - c'est OBLIGATOIRE
2. Donne les TAUX EXACTS et les ARTICLES DE LOI (CGI, LPF, BOFiP)
3. Mentionne les SEUILS et CONDITIONS d'application
4. Si les sources datent de plus d'1 an, PRÉVIENS l'utilisateur
5. Ne JAMAIS inventer - si tu ne sais pas, dis-le
6. Structure ta réponse clairement avec des bullet points si nécessaire

QUESTION: ${question}

SOURCES OFFICIELLES ANALYSÉES (${sources.length}):
${context}

Réponds en JSON:
{
  "answer": "Réponse détaillée et structurée avec citations [Source X]",
  "confidence": "high|medium|low",
  "keyRates": ["taux trouvés avec leur contexte"],
  "keyArticles": ["articles de loi cités"]
}`;

    const openaiResponse = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });
    
    const openaiData = await openaiResponse.json();
    
    if (openaiData.error) {
      console.log('❌ OpenAI error:', openaiData.error?.message || openaiData.error);
      return res.json({
        answer: "Erreur IA. Sources ci-dessous.",
        sources: sources.map(s => ({ title: s.title, url: s.url, source: s.source, date: s.date, isRecent: s.isRecent })),
        confidence: 'low'
      });
    }
    
    const parsed = JSON.parse(openaiData.choices?.[0]?.message?.content || '{}');
    const totalTime = Date.now() - startTime;
    
    console.log(`✅ Réponse en ${totalTime}ms`);
    
    res.json({
      answer: parsed.answer || "Erreur",
      sources: sources.map(s => ({ title: s.title, url: s.url, source: s.source, date: s.date, isRecent: s.isRecent })),
      confidence: parsed.confidence || 'medium',
      keyRates: parsed.keyRates || [],
      keyArticles: parsed.keyArticles || [],
      stats: { sourcesFound: unique.length, sourcesAnalyzed: sources.length, timeMs: totalTime }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Atlas Search Backend v3.0 running on port ${PORT}`);
  console.log(`📋 ${ALL_ALLOWED_DOMAINS.size} whitelisted domains`);
  console.log(`📑 PDF extraction enabled`);
  console.log(`⚖️ Law parsing enabled`);
  console.log(`🔍 Jurisprudence search enabled`);
});

// Cleanup
process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit();
});
