import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());
app.use(express.json());

let browser = null;

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
  res.json({ status: 'ok', service: 'Atlas Search Backend' });
});

// Web Search
app.post('/search', async (req, res) => {
  const { query, maxResults = 10 } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }
  
  console.log('🔍 Searching:', query);
  
  try {
    const b = await getBrowser();
    const page = await b.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });
    
    // DuckDuckGo Search (more permissive)
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&ia=web`;
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
    
    console.log(`✅ Found ${results.length} results`);
    res.json({ results: results.slice(0, maxResults), count: results.length });
    
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
  
  console.log('📄 Extracting:', url);
  
  try {
    const b = await getBrowser();
    const page = await b.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const data = await page.evaluate(() => {
      // Remove unwanted elements
      document.querySelectorAll('script, style, nav, footer, header, aside, iframe').forEach(el => el.remove());
      
      const title = document.title || '';
      const main = document.querySelector('main, article, .content, #content, .post-content') || document.body;
      const content = main.textContent.replace(/\s+/g, ' ').trim().substring(0, 15000);
      
      return { title, content };
    });
    
    await page.close();
    
    console.log(`✅ Extracted: ${data.title.substring(0, 50)}...`);
    res.json({ url, title: data.title, content: data.content });
    
  } catch (error) {
    console.error('❌ Extract error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Atlas Search Backend running on port ${PORT}`);
});

// Cleanup
process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit();
});
