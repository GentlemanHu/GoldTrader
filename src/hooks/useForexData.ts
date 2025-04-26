import { useState, useEffect } from 'react';
import { fetchForexData, fetchForexTimeSeries } from '../utils/api';

export const useForexData = (refreshInterval = 60000, interval: string = '1day', outputsize: number = 60) => {
  const [currentPrice, setCurrentPrice] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;
    const CACHE_KEY = `goldtrader_xauusd_cache_${interval}_${outputsize}`;
    const CACHE_TTL = 60 * 1000; // 1 minute

    const getCachedData = () => {
      const cache = localStorage.getItem(CACHE_KEY);
      if (!cache) return null;
      try {
        const parsed = JSON.parse(cache);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          return parsed;
        }
        return null;
      } catch {
        return null;
      }
    };

    const setCachedData = (priceData: any, timeSeriesData: any) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        priceData,
        timeSeriesData,
        timestamp: Date.now()
      }));
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        // Try cache first
        const cached = getCachedData();
        if (cached) {
          if (isMounted) {
            setCurrentPrice(cached.priceData);
            setHistoricalData(cached.timeSeriesData);
            setError(null);
            setLoading(false);
          }
          return;
        }
        const [priceData, timeSeriesData] = await Promise.all([
          fetchForexData(),
          fetchForexTimeSeries(interval, outputsize)
        ]);
        if (isMounted) {
          setCurrentPrice(priceData);
          setHistoricalData(timeSeriesData);
          setCachedData(priceData, timeSeriesData);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          // If rate limited, try to use stale cache as fallback
          const cached = getCachedData();
          if (cached) {
            setCurrentPrice(cached.priceData);
            setHistoricalData(cached.timeSeriesData);
            setError('You are seeing cached data due to API rate limits.');
          } else {
            setError(err.message || 'Unable to fetch gold price data. Please try again later.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchData, refreshInterval);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [refreshInterval]);

  return { 
    currentPrice, 
    historicalData, 
    loading, 
    error,
    price: currentPrice ? parseFloat(currentPrice['5. Exchange Rate']) : null
  };
};