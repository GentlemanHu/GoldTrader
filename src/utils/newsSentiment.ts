import axios from 'axios';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;
const TWINWORD_API_KEY = import.meta.env.VITE_TWINWORD_API_KEY;

export interface NewsItemRaw {
  id: string;
  title: string;
  snippet: string;
  link: string;
  source: string;
  date: string;
}

export interface NewsSentiment {
  id: string;
  title: string;
  summary: string;
  link: string; // Direct article URL
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // Twinword score
  impact: 'high' | 'medium' | 'low';
}

// Fetch recent gold news from Serperdev
export async function fetchGoldNews(count = 10): Promise<NewsItemRaw[]> {
  const resp = await axios.post(
    'https://google.serper.dev/news',
    { q: 'gold XAUUSD', num: count },
    { headers: { 'X-API-KEY': SERPER_API_KEY } }
  );
  const data = resp.data as { news: any[] };
  return data.news.map((n: any, i: number) => ({
    id: n.link || String(i),
    title: n.title,
    snippet: n.snippet,
    link: n.link,
    source: n.source,
    date: n.date,
  }));
}

// Analyze sentiment using Twinword
export async function analyzeSentimentTwinword(text: string): Promise<{ type: 'positive'|'negative'|'neutral', score: number }> {
  const resp = await axios.post(
    'https://api.twinword.com/api/v7/text/sentiment/',
    new URLSearchParams({ text }),
    { headers: { 'X-Twaip-Key': TWINWORD_API_KEY } }
  );
  const data = resp.data as { type: 'positive'|'negative'|'neutral', score: number|string };
  const { type, score } = data;
  return { type, score: typeof score === 'number' ? score : parseFloat(score) };
}

// Get enriched news with sentiment
export async function getNewsWithSentiment(count = 10): Promise<NewsSentiment[]> {
  const news = await fetchGoldNews(count);
  const results: NewsSentiment[] = [];
  for (const n of news) {
    try {
      const sentiment = await analyzeSentimentTwinword(n.title + '. ' + n.snippet);
      // Assign impact based on score
      let impact: 'high'|'medium'|'low' = 'low';
      if (Math.abs(sentiment.score) > 0.5) impact = 'high';
      else if (Math.abs(sentiment.score) > 0.2) impact = 'medium';
      results.push({
        id: n.id,
        title: n.title,
        summary: n.snippet,
        link: n.link,
        source: n.source,
        date: n.date,
        sentiment: sentiment.type,
        score: sentiment.score,
        impact,
      });
    } catch (e) {
      // fallback to neutral if sentiment API fails
      results.push({
        id: n.id,
        title: n.title,
        summary: n.snippet,
        link: n.link,
        source: n.source,
        date: n.date,
        sentiment: 'neutral',
        score: 0,
        impact: 'low',
      });
    }
  }
  return results;
}
