import axios from 'axios';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TWELVEDATA_API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY;

export const fetchMarketData = async (endpoint: string) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/market-data/${endpoint}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

export const fetchForexData = async () => {
  try {
    const response = await axios.get(`https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${TWELVEDATA_API_KEY}`);
    const data = response.data as Record<string, any>;
    console.log('Twelve Data response (price):', data);
    if (data.status === 'error') {
      throw new Error(data.message || 'Twelve Data API error');
    }
    if (!data.price) {
      throw new Error('No price data available');
    }
    return {
      '5. Exchange Rate': data.price,
      '1. From_Currency Code': 'XAU',
      '3. To_Currency Code': 'USD',
      '6. Last Refreshed': data.datetime || new Date().toISOString(),
      provider: 'Twelve Data'
    };
  } catch (error) {
    console.error('Error fetching forex data:', error);
    throw error;
  }
};

// Fetch historical price data for XAU/USD from Twelve Data
export const fetchForexTimeSeries = async (interval = '1day', outputsize = 60) => {
  try {
    const response = await axios.get(
      `https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVEDATA_API_KEY}`
    );
    const data = response.data as Record<string, any>;
    console.log('Twelve Data response (time_series):', data);
    if (data.status === 'error') {
      throw new Error(data.message || 'Twelve Data API error');
    }
    if (!data.values) {
      throw new Error('No historical data available');
    }
    return data.values;
  } catch (error) {
    console.error('Error fetching forex time series:', error);
    throw error;
  }
};