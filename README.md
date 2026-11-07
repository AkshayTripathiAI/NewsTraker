# NewsTraker

A news aggregator web app. Pick a category, optionally search within it, and browse top headlines from [NewsAPI](https://newsapi.org/) as cards. The API key stays on a small Express proxy, never in the browser.

## Features

- Seven categories as tabs: General, Business, Technology, Science, Health, Sports and Entertainment.
- Keyword search within the selected category.
- Responsive card grid showing the image (with a placeholder when an image is missing or broken), source, publish time, title, description and a "Read more" link.
- Loading skeletons, an empty state, and clear error messages, e.g. when the proxy is not running or the API key is missing.
- The Express proxy (`api/index.js`) validates the category, sends the key in the `X-Api-Key` header, filters out `[Removed]` articles and passes NewsAPI's error messages through.
- The API URL is configurable through `REACT_APP_API_URL`; nothing is hard-coded.

## Tech stack

- React 18 (Create React App / `react-scripts`), Axios
- Node.js + Express 4, `cors`, `dotenv` (API proxy)
- NewsAPI `v2/top-headlines`
- Jest + React Testing Library

## Getting started

Prerequisites: Node.js 18+, npm, and a free API key from https://newsapi.org/.

```bash
git clone https://github.com/AkshayTripathiAI/NewsTraker.git
cd NewsTraker
npm install
cp .env.example .env      # then set NEWS_API_KEY
```

Start the API proxy and the React app in two terminals:

```bash
npm run server            # Express proxy on http://localhost:3001
npm start                 # React app on http://localhost:3000
```

### Configuration (`.env`)

| Variable | Used by | Default | Description |
| --- | --- | --- | --- |
| `NEWS_API_KEY` | proxy | (required) | Your NewsAPI key |
| `PORT` | proxy | `3001` | Proxy port |
| `NEWS_COUNTRY` | proxy | `us` | Country code for top headlines |
| `CORS_ORIGIN` | proxy | `*` | Allowed origin, e.g. `http://localhost:3000` |
| `REACT_APP_API_URL` | React app | `http://localhost:3001` | Base URL of the proxy (read when `npm start` / `npm run build` runs) |

`.env` is git-ignored; [`.env.example`](.env.example) lists every variable.

### API

| Endpoint | Description |
| --- | --- |
| `GET /news?category=technology&q=ai` | Top headlines for a category; `q` (keyword), `country` and `pageSize` (max 100) are optional |
| `GET /health` | `{ "status": "ok", "apiKeyConfigured": true }` |

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the React dev server |
| `npm run server` | Start the Express proxy |
| `npm test` | Run the tests (Axios is mocked; no API key needed) |
| `npm run build` | Production build into `build/` |

Note: NewsAPI's free Developer plan only accepts requests from `localhost`, so a public deployment needs a paid plan or a different news source.

## Project structure

```
api/
└── index.js                       # Express proxy: GET /news -> NewsAPI top-headlines
src/
├── App.js                         # Category tabs, search, loading/error states, card grid
├── App.css
├── App.test.js
└── component/Cards/newsCard.jsx   # Article card
.env.example
```
