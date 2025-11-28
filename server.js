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
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

// Fonction de recherche web réutilisable
async function webSearch(query, maxResults = 5) {
  console.log(`🔍 Recherche: "${query}"`);
  const b = await getBrowser();
  const page = await b.newPage();
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&ia=web`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForSelector('[data-testid="result"]', { timeout: 8000 }).catch(() => {});
    
    const results = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid="result"]');
      return Array.from(items).slice(0, 10).map(item => {
        const link = item.querySelector('a[data-testid="result-title-a"]');
        const snippet = item.querySelector('[data-result="snippet"]');
        return {
          title: link?.textContent?.trim() || '',
          url: link?.href || '',
          snippet: snippet?.textContent?.trim() || ''
        };
      }).filter(r => r.url && r.title);
    });
    
    await page.close();
    
    // Filtrer par whitelist
    const filtered = results.filter(r => {
      try {
        const domain = new URL(r.url).hostname.replace('www.', '');
        return isAllowedDomain(domain);
      } catch { return false; }
    }).slice(0, maxResults);
    
    console.log(`   → ${filtered.length} résultats filtrés`);
    return filtered;
  } catch (e) {
    await page.close().catch(() => {});
    console.log(`   → Erreur: ${e.message}`);
    return [];
  }
}

// Fonction d'extraction de contenu
async function extractContent(url, maxChars = 3000) {
  console.log(`📄 Extraction: ${url}`);
  const b = await getBrowser();
  const page = await b.newPage();
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const content = await page.evaluate(() => {
      const selectors = ['article', 'main', '.content', '#content', '.post-content', 'body'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.length > 200) {
          return el.innerText.replace(/\s+/g, ' ').trim();
        }
      }
      return document.body?.innerText?.replace(/\s+/g, ' ').trim() || '';
    });
    
    await page.close();
    return content.slice(0, maxChars);
  } catch (e) {
    await page.close().catch(() => {});
    return '';
  }
}

// Agent de raisonnement
async function agentReasoning(question, openaiKey) {
  const planPrompt = `Tu es un agent de recherche fiscale. Analyse cette question et génère un PLAN DE RECHERCHE.

QUESTION: ${question}

Génère une liste de 3-5 recherches web spécifiques à effectuer pour répondre complètement.
Chaque recherche doit être précise et ciblée.

Réponds en JSON:
{
  "analysis": "Brève analyse des points à traiter",
  "searches": [
    "recherche 1 précise",
    "recherche 2 précise",
    "recherche 3 précise"
  ]
}`;

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: planPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });
  
  const data = await response.json();
  return JSON.parse(data.choices?.[0]?.message?.content || '{"searches":[]}');
}


app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });
  
  console.log('\n🤖 ATLAS AGENT - Question:', question);
  const startTime = Date.now();
  
  try {
    // ============================================
    // ÉTAPE 1: PLANIFICATION - L'agent analyse et planifie ses recherches
    // ============================================
    console.log('🧠 Étape 1: Planification des recherches...');
    
    const plan = await agentReasoning(question, OPENAI_API_KEY);
    console.log(`   📋 Plan: ${plan.analysis || 'Analyse en cours'}`);
    console.log(`   🔍 ${plan.searches?.length || 0} recherches planifiées`);
    
    // ============================================
    // ÉTAPE 2: RECHERCHES WEB PARALLÈLES
    // ============================================
    console.log('🌐 Étape 2: Recherches web parallèles...');
    
    const searches = plan.searches || [question];
    const searchPromises = searches.slice(0, 5).map(q => webSearch(q + ' site:gouv.fr OR site:bofip.impots.gouv.fr', 3));
    const searchResults = await Promise.all(searchPromises);
    
    // Dédupliquer les résultats
    const allResults = searchResults.flat();
    const seenUrls = new Set();
    const uniqueResults = allResults.filter(r => {
      if (seenUrls.has(r.url)) return false;
      seenUrls.add(r.url);
      return true;
    }).slice(0, 8);
    
    console.log(`   📊 ${allResults.length} résultats → ${uniqueResults.length} uniques`);
    
    // ============================================
    // ÉTAPE 3: EXTRACTION DU CONTENU DES PAGES
    // ============================================
    console.log('📄 Étape 3: Extraction du contenu...');
    
    const extractPromises = uniqueResults.map(async (r) => {
      const content = await extractContent(r.url, 4000);
      if (content.length > 200) {
        return {
          title: r.title,
          url: r.url,
          source: new URL(r.url).hostname.replace('www.', ''),
          snippet: r.snippet,
          content,
          date: null,
          isRecent: false
        };
      }
      return null;
    });
    
    const extractedResults = await Promise.all(extractPromises);
    const sources = extractedResults.filter(Boolean);
    console.log(`   ✅ ${sources.length}/${uniqueResults.length} pages extraites`);
    
    if (sources.length === 0) {
      return res.json({
        answer: "❌ Aucune source officielle trouvée pour cette question.",
        sources: [],
        confidence: 'low'
      });
    }
    
    // ============================================
    // ÉTAPE 4: SYNTHÈSE PAR L'IA
    // ============================================
    console.log('🤖 Étape 4: Synthèse IA...');
    
    const context = sources.map((s, i) => 
      `[Source ${i+1}: ${s.title}]\n${s.url}\n${s.content.substring(0, 3000)}`
    ).join('\n\n---\n\n');
    
    const prompt = `Tu es un EXPERT FISCAL FRANÇAIS. Réponds de manière PRÉCISE et CONCRÈTE.

SOURCES WEB (utilise ces informations):
${context}

RÈGLES DE RÉPONSE:
1. Réponds de manière FLUIDE (pas de titres "QUESTION 1:", "RÉGIME:", etc.)
2. Cite les ARTICLES DE LOI dans le texte: "...exonérés (article 262 ter I CGI)..."
3. Donne les TAUX EXACTS: "15%", "25%", "0%"
4. Fais les CALCULS si des montants sont donnés
5. Ne dis JAMAIS "il convient de", "consultez", "vérifiez"

QUESTION:
${question}

Réponds en JSON:
{
  "answer": "Ta réponse experte fluide et complète",
  "confidence": "high|medium|low"
}`;

    const openaiResponse = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 8192,
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
    
    // Fonction pour convertir tout en string
    const stringify = (val) => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'object') {
        return Object.entries(val).map(([k, v]) => `${k}: ${stringify(v)}`).join('\n');
      }
      return String(val);
    };
    
    // S'assurer que answer est une string
    let answer = stringify(parsed.answer) || "Erreur";
    
    // Nettoyer les risks pour s'assurer que ce sont des strings
    const risks = (parsed.risks || []).map(r => ({
      risk: stringify(r.risk || r),
      probability: stringify(r.probability) || 'Moyenne',
      impact: stringify(r.impact) || ''
    }));
    
    // Nettoyer les calculs
    const calculations = (parsed.calculations || []).map(a => stringify(a));
    
    // Nettoyer keyRates et keyArticles
    const keyRates = (parsed.keyRates || []).map(r => stringify(r));
    const keyArticles = (parsed.keyArticles || []).map(a => stringify(a));
    
    res.json({
      answer,
      sources: sources.map(s => ({ title: s.title, url: s.url, source: s.source })),
      confidence: parsed.confidence || 'medium',
      stats: { 
        searchQueries: searches.length,
        sourcesFound: uniqueResults.length, 
        sourcesAnalyzed: sources.length, 
        timeMs: totalTime 
      }
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
