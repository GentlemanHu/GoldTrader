import { useEffect, useState } from 'react';
import { getNewsWithSentiment, NewsSentiment } from '../utils/newsSentiment';

interface UseNewsSentimentResult {
  news: NewsSentiment[];
  loading: boolean;
  error: string | null;
}

export function useNewsSentiment(count = 10, cacheMinutes = 10): UseNewsSentimentResult {
  const [news, setNews] = useState<NewsSentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `news-sentiment-cache-v1`;
    const cacheTTL = cacheMinutes * 60 * 1000;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < cacheTTL) {
          setNews(parsed.data);
          setLoading(false);
          return;
        }
      } catch {}
    }
    setLoading(true);
    getNewsWithSentiment(count)
      .then(data => {
        if (!cancelled) {
          setNews(data);
          setLoading(false);
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to fetch news sentiment.');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [count, cacheMinutes]);

  return { news, loading, error };
}
