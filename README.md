# GoldTrader AI

GoldTrader AI is a modern, full-stack web app for real-time news sentiment analysis and trading insights for XAUUSD (Gold). It leverages advanced APIs and AI to help traders make informed decisions.

## Features
- Real-time gold news aggregation with direct source links
- Sentiment analysis using AI (Twinword API)
- Interactive sentiment chart and summary
- Adjustable lookback period and sentiment threshold
- Secure API key management (via `.env`)
- Responsive, modern UI (React + TailwindCSS)

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/dyglo/GoldTrader.git
cd GoldTrader/project
```

### 2. Install dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your API keys:
```sh
cp .env.example .env
# Then edit .env with your actual keys
```

### 4. Run the app locally
```sh
npm run dev
```

## Deployment
### Vercel
1. Push your code to GitHub (already done).
2. Go to [Vercel](https://vercel.com/) and import your GitHub repo.
3. In Vercel dashboard, add the same variables from `.env.example` to your project’s Environment Variables.
4. Deploy!

## Security
- **Never commit your actual `.env` file or secrets.**
- Use `.env.example` for documentation only.
- All API keys must be set in your Vercel (or other host) dashboard.

## License
MIT

---

**Built with React, TypeScript, TailwindCSS, and ❤️ by dyglo.**
