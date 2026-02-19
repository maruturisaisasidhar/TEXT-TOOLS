# Texttools - AI-Powered Text Processing App

A modern web application for text processing using AI (rephrase, summarize, grammar check, translate).

## Features

- ✅ AI-powered text operations (Llama 3.1 via OpenRouter)
- ✅ Session management & history tracking
- ✅ Dictionary lookup
- ✅ Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **AI**: OpenRouter API (Llama 3.1-8B)

## Local Development

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```
OPENROUTER_API_KEY=your_api_key
PORT=5000
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
```

## Deployment

### Backend (Render / Railway / Heroku)

1. Connect your GitHub repo
2. Set environment variable: `OPENROUTER_API_KEY`
3. Deploy!

### Frontend (Vercel / Netlify)

1. Connect your GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL` to your backend URL

## License

MIT
