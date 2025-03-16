import { Hono } from 'hono'
import { handle } from 'hono/vercel'
// import fake user agent
import randomUseragent from 'random-useragent';

export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('/api')

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' })
})

app.get('/useragent', (c) => {
  const browser = c.req.query('browser');
  
  if (browser) {
    // Get user agent for specific browser (case-insensitive)
    const userAgent = randomUseragent.getRandom(function(ua) {
      return ua.browserName ? ua.browserName.toLowerCase() === browser.toLowerCase() : false;
    });
    
    if (!userAgent) {
      c.status(404);
      return c.json({ error: `No user agent found for browser: ${browser}` });
    }
    c.status(200);
    return c.json({ userAgent });
  }
  
  // Return random user agent from any browser
  return c.json({ userAgent: randomUseragent.getRandom() });
})

export default handle(app)
