# NewsTraker

A News Aggregator web app: pick a category and browse top headlines from [NewsAPI](https://newsapi.org/), served through a small Express proxy.

Built as a practice project while learning React.

## Features

- Choose a category: General, Business or Technology.
- Headlines load automatically when the category changes; a "Fetch News" button reloads them.
- Each article is shown as a card with image, title, description and a "Read more" link to the source.
- The NewsAPI key stays on the server: the React app calls a local Express endpoint (`GET /news?category=...`), which calls NewsAPI's `top-headlines`.

## Tech stack

- React 18 (Create React App / `react-scripts`)
- Axios
- Node.js + Express, `cors`, `dotenv` (API proxy in `api/index.js`)
- NewsAPI

## Getting started

Prerequisites: Node.js 16+, npm, and a free API key from https://newsapi.org/.

```bash
git clone https://github.com/AkshayTripathiAI/NewsTraker.git
cd NewsTraker
npm install
```

Create a `.env` file in the project root (it is git-ignored):

```env
NEWS_API_KEY=your-newsapi-key
# optional, defaults to 3001
PORT=3001
```

Start the API proxy (from the project root, so `dotenv` finds `.env`):

```bash
node api/index.js
```

In a second terminal, start the React app:

```bash
npm start
```

The app opens at http://localhost:3000 and expects the proxy at `http://localhost:3001` (hard-coded in `src/App.js`).

## Project structure

```
api/
└── index.js                  # Express proxy: GET /news -> NewsAPI top-headlines
src/
├── App.js                    # Category selector, fetching, card grid
├── App.css
└── component/Cards/newsCard.jsx  # Article card
```
