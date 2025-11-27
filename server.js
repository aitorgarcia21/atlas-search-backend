/**
 * ATLAS FISCAL - SERVEUR UNIFIÉ
 * Puppeteer + Groq + API tout-en-un
 */

import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());
app.use(express.json());

// Config
const PORT = process.env.PORT || 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Browser singleton
let browser = null;
async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }
  return browser;
}

// Whitelist des domaines autorisés
const ALLOWED_DOMAINS = new Set([
  // Big Four
  'deloitte.com', 'pwc.com', 'ey.com', 'kpmg.com',
  'taxsummaries.pwc.com', 'blog.avocats.deloitte.fr',
  // France
  'legifrance.gouv.fr', 'impots.gouv.fr', 'bofip.impots.gouv.fr', 
  'economie.gouv.fr', 'service-public.fr', 'tresor.economie.gouv.fr',
  // International
  'oecd.org', 'europa.eu', 'eur-lex.europa.eu', 'ec.europa.eu',
  'taxfoundation.org', 'taxnotes.com',
  // UK
  'gov.uk', 'hmrc.gov.uk', 'legislation.gov.uk',
  // Germany
  'bundesfinanzministerium.de', 'gesetze-im-internet.de',
  // USA
  'irs.gov', 'treasury.gov',
  // Others
  'iras.gov.sg', 'ird.gov.hk', 'gov.hk', 'gov.je',
  'tax.gov.ae', 'assets.kpmg.com', 'taxnews.ey.com',
]);

function isAllowed(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const domain of ALLOWED_DOMAINS) {
      if (hostname === domain || hostname.endsWith('.' + domain)) return true;
    }
    return false;
  } catch { return false; }
}

// ============================================================================
// ENDPOINT UNIQUE : /ask - Fait tout en un seul appel
// ============================================================================

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });
  
  console.log('\n🤖 ATLAS FISCAL - Question:', question);
  const startTime = Date.now();
  
  try {
    const year = new Date().getFullYear();
    const b = await getBrowser();
    
    // PHASE 1: Recherche DuckDuckGo
    console.log('🔍 Recherche...');
    const queries = [
      `${question} ${year}`,
      `${question} fiscalité ${year}`,
      `${question} tax rate ${year}`,
    ];
    
    const allResults = [];
    for (const query of queries) {
      const page = await b.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      try {
        await page.goto(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });
        
        const results = await page.evaluate(() => {
          const items = [];
          document.querySelectorAll('.result').forEach(el => {
            const link = el.querySelector('a.result__a');
            const snippet = el.querySelector('.result__snippet');
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
        
        allResults.push(...results);
      } catch (e) {
        console.log('⚠️ Search error:', e.message);
      }
      await page.close();
    }
    
    // Filtrer et dédupliquer
    const filtered = allResults.filter(r => isAllowed(r.url));
    const unique = Array.from(new Map(filtered.map(r => [r.url, r])).values()).slice(0, 10);
    console.log(`📊 ${unique.length} sources officielles trouvées`);
    
    // PHASE 2: Extraction du contenu
    console.log('📄 Extraction...');
    const sources = [];
    
    for (const result of unique.slice(0, 6)) {
      const page = await b.newPage();
      try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        await page.goto(result.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        
        const data = await page.evaluate(() => {
          // Date
          let date = null;
          const metaDate = document.querySelector('meta[property="article:published_time"], meta[name="date"]');
          if (metaDate) date = metaDate.getAttribute('content');
          if (!date) {
            const timeEl = document.querySelector('time[datetime]');
            if (timeEl) date = timeEl.getAttribute('datetime');
          }
          
          // Content
          document.querySelectorAll('script, style, nav, footer, header, aside').forEach(el => el.remove());
          const main = document.querySelector('main, article, .content') || document.body;
          const content = main.textContent.replace(/\s+/g, ' ').trim().substring(0, 8000);
          
          return { title: document.title, content, date };
        });
        
        // Skip Cloudflare pages
        if (data.title.includes('Just a moment') || data.content.length < 200) {
          await page.close();
          continue;
        }
        
        sources.push({
          title: data.title,
          url: result.url,
          source: result.source,
          date: data.date,
          content: data.content,
          isRecent: data.date && new Date(data.date) > new Date(Date.now() - 365*24*60*60*1000)
        });
        
        console.log(`   ✅ ${result.source}`);
      } catch (e) {
        console.log(`   ❌ ${result.source}: ${e.message}`);
      }
      await page.close();
    }
    
    if (sources.length === 0) {
      return res.json({
        answer: "❌ Aucune source officielle trouvée pour cette question.",
        sources: [],
        confidence: 'low'
      });
    }
    
    // PHASE 3: Synthèse Groq
    console.log('🤖 Synthèse Groq...');
    
    const context = sources.map((s, i) => 
      `[Source ${i+1}: ${s.title}] (${s.date || 'date inconnue'})\n${s.url}\n${s.content.substring(0, 2000)}`
    ).join('\n\n---\n\n');
    
    const prompt = `Tu es expert fiscal. Réponds précisément à la question.

RÈGLES STRICTES:
1. Cite TOUJOURS tes sources avec [Source X]
2. Donne les taux et articles de loi exacts
3. Si les sources sont anciennes (>1 an), préviens l'utilisateur
4. Ne jamais inventer d'information

QUESTION: ${question}

SOURCES (${sources.length} documents officiels analysés):
${context}

Réponds en JSON: {"answer": "ta réponse détaillée avec citations [Source X]", "confidence": "high|medium|low", "keyRates": ["taux trouvés"], "keyArticles": ["articles de loi"]}`;

    const groqResponse = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });
    
    const groqData = await groqResponse.json();
    
    if (groqData.error) {
      console.log('❌ Groq error:', groqData.error.message);
      return res.json({
        answer: "Erreur de synthèse IA. Sources disponibles ci-dessous.",
        sources: sources.map(s => ({ title: s.title, url: s.url, source: s.source, date: s.date, isRecent: s.isRecent })),
        confidence: 'low'
      });
    }
    
    const parsed = JSON.parse(groqData.choices?.[0]?.message?.content || '{}');
    
    const totalTime = Date.now() - startTime;
    console.log(`✅ Réponse générée en ${totalTime}ms`);
    
    res.json({
      answer: parsed.answer || "Erreur de parsing",
      sources: sources.map(s => ({ 
        title: s.title, 
        url: s.url, 
        source: s.source, 
        date: s.date, 
        isRecent: s.isRecent 
      })),
      confidence: parsed.confidence || 'medium',
      keyRates: parsed.keyRates || [],
      keyArticles: parsed.keyArticles || [],
      stats: {
        sourcesFound: unique.length,
        sourcesAnalyzed: sources.length,
        timeMs: totalTime
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Atlas Fiscal API', version: '2.0' });
});

app.listen(PORT, () => {
  console.log(`🚀 Atlas Fiscal API running on port ${PORT}`);
});
