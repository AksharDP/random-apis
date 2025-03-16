import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const config = {
  runtime: 'edge'
}

type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge';

const userAgents: Record<BrowserType, string[]> = {
  chrome: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  ],
  firefox: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0"
  ],
  safari: [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  ],
  edge: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
  ]
};

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' })
})

app.get('/useragent', (c) => {
  const browser = c.req.query('browser');
  
  if (browser) {
    const browserLower = browser.toLowerCase();
    
    if (!Object.keys(userAgents).includes(browserLower)) {
      c.status(404);
      return c.json({ error: `No user agent found for browser: ${browser}` });
    }
    
    const browserKey = browserLower as BrowserType;
    const agents = userAgents[browserKey];
    
    if (agents.length === 0) {
      c.status(404);
      return c.json({ error: `No user agent found for browser: ${browser}` });
    }
    
    const randomIndex = Math.floor(Math.random() * agents.length);
    const userAgent = agents[randomIndex];
    
    c.status(200);
    return c.json({ userAgent });
  }
  
  const allBrowsers = Object.keys(userAgents) as BrowserType[];
  const randomBrowser = allBrowsers[Math.floor(Math.random() * allBrowsers.length)];
  const randomIndex = Math.floor(Math.random() * userAgents[randomBrowser].length);
  const userAgent = userAgents[randomBrowser][randomIndex];
  
  return c.json({ userAgent });
})

export default handle(app)