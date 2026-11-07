// api/index.js
// Small Express proxy that keeps the NewsAPI key on the server.
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const DEFAULT_COUNTRY = process.env.NEWS_COUNTRY || 'us';

// Categories supported by NewsAPI's /v2/top-headlines endpoint.
const CATEGORIES = new Set([
  'general',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology',
]);

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', apiKeyConfigured: Boolean(NEWS_API_KEY) });
});

app.get('/news', async (req, res) => {
  if (!NEWS_API_KEY) {
    return res
      .status(500)
      .json({ error: 'NEWS_API_KEY is not set on the server. Add it to your .env file.' });
  }

  const category = String(req.query.category || 'general').toLowerCase();
  if (!CATEGORIES.has(category)) {
    return res.status(400).json({
      error: `Unknown category "${category}". Use one of: ${[...CATEGORIES].join(', ')}.`,
    });
  }

  const params = {
    category,
    country: String(req.query.country || DEFAULT_COUNTRY),
    pageSize: Math.min(Number(req.query.pageSize) || 30, 100),
  };
  if (req.query.q) params.q = String(req.query.q);

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params,
      headers: { 'X-Api-Key': NEWS_API_KEY },
      timeout: 10000,
    });
    // NewsAPI marks deleted articles with the title "[Removed]".
    const articles = (response.data.articles || []).filter(
      (article) => article.title && article.title !== '[Removed]'
    );
    res.json(articles);
  } catch (error) {
    const status = error.response?.status || 502;
    const message = error.response?.data?.message || error.message;
    console.error('Error fetching news:', message);
    res.status(status).json({ error: `NewsAPI request failed: ${message}` });
  }
});

app.listen(port, () => {
  console.log(`News API proxy running on http://localhost:${port}`);
  if (!NEWS_API_KEY) {
    console.warn('Warning: NEWS_API_KEY is not set; /news requests will fail.');
  }
});
