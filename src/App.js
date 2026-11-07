import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './component/Cards/newsCard';
import './App.css';

export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001').replace(/\/$/, '');

const CATEGORIES = [
  'general',
  'business',
  'technology',
  'science',
  'health',
  'sports',
  'entertainment',
];

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const App = () => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNews = useCallback(async (category, query = '') => {
    setLoading(true);
    setError('');
    try {
      const params = { category };
      if (query.trim()) params.q = query.trim();
      const response = await axios.get(`${API_URL}/news`, { params });
      setNews(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        `Could not reach the news API at ${API_URL}. Is the proxy running (npm run server)?`;
      setError(message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory, fetchNews]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchNews(selectedCategory, search);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>News Aggregator</h1>
        <p className="subtitle">Top headlines from NewsAPI, by category.</p>
      </header>

      <nav className="category-tabs" aria-label="News categories">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`tab ${category === selectedCategory ? 'active' : ''}`}
            aria-pressed={category === selectedCategory}
            onClick={() => setSelectedCategory(category)}
          >
            {capitalize(category)}
          </button>
        ))}
      </nav>

      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder={`Search ${selectedCategory} headlines...`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search headlines"
        />
        <button id="fetch-news-btn" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch News'}
        </button>
      </form>

      {error && (
        <div className="status error" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="news-container" aria-busy="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="news-card skeleton" />
          ))}
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <div className="status">No articles found.</div>
      )}

      {!loading && news.length > 0 && (
        <div className="news-container">
          {news.map((article) => (
            <NewsCard key={article.url || article.title} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
