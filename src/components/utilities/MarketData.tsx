import React, { useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

import TradingViewSymbolInfo from '../market/TradingViewSymbolInfo';
import TradingViewAdvancedChart from '../market/TradingViewAdvancedChart';
import TradingViewTechnicalAnalysis from '../market/TradingViewTechnicalAnalysis';
import TradingViewEconomicCalendar from '../market/TradingViewEconomicCalendar';
import TradingViewNews from '../market/TradingViewNews';


import { fetchForexTimeSeries } from '../../utils/api';
// No pivotpoints in technicalindicators; calculate manually below.

const MarketData: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1D');
  

  // Inline type definitions for indicators and news
  type MarketIndicator = {
    name: string;
    value: string;
    change: string;
    isPositive: boolean;
  };


  // Support & Resistance state
  const [levels, setLevels] = useState({
    strongResistance: undefined as number | undefined,
    weakResistance: undefined as number | undefined,
    weakSupport: undefined as number | undefined,
    strongSupport: undefined as number | undefined,
  });
  const [srLoading, setSrLoading] = useState(false);
  const [srError, setSrError] = useState<string | null>(null);

  // Debounced fetch for support/resistance (avoid rate limits)
  React.useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;
    setSrLoading(true);
    setSrError(null);
    debounceTimeout = setTimeout(async () => {
      try {
        const priceData = await fetchForexTimeSeries('1day', 30);
        // technicalindicators does not provide pivotpoints, so we calculate classic pivots manually
        const highs = priceData.map((c: any) => parseFloat(c.high)).reverse();
        const lows = priceData.map((c: any) => parseFloat(c.low)).reverse();
        const closes = priceData.map((c: any) => parseFloat(c.close)).reverse();
        // Use the most recent candle for pivots
        const high = highs[highs.length - 1];
        const low = lows[lows.length - 1];
        const close = closes[closes.length - 1];
        // Classic Pivot Point formula
        const PP = (high + low + close) / 3;
        const R1 = 2 * PP - low;
        const S1 = 2 * PP - high;
        const R2 = PP + (high - low);
        const S2 = PP - (high - low);
        setLevels({
          strongResistance: R2,
          weakResistance: R1,
          weakSupport: S1,
          strongSupport: S2,
        });
        setSrLoading(false);
      } catch (err: any) {
        setSrError(err?.message || 'Failed to load technical analysis');
        setSrLoading(false);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(debounceTimeout);
  }, []);

  const indicators: MarketIndicator[] = [
    { name: 'RSI (14)', value: '65.8', change: '+2.3', isPositive: true },
    { name: 'MACD', value: '0.0045', change: '-0.0012', isPositive: false },
    { name: 'ATR', value: '1.25', change: '+0.15', isPositive: true },
    { name: 'Volume', value: '125.4K', change: '+12.5%', isPositive: true }
  ];

  // Use real-time news sentiment data
  

  const correlations = [
    { asset: 'USD', value: -0.85, isStrong: true },
    { asset: 'EUR', value: 0.65, isStrong: true },
    { asset: 'SPX500', value: -0.35, isStrong: false },
    { asset: 'VIX', value: 0.45, isStrong: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Market Data</h1>
          <p className="text-gray-400">
            Real-time market analysis and indicators for XAUUSD
          </p>
        </div>
        
        <div className="flex space-x-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {['1H', '4H', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-2 text-sm font-medium ${
                  timeframe === tf
                    ? 'bg-amber-500 text-gray-900'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } ${
                  tf === '1H' ? 'rounded-l-md' : tf === '1W' ? 'rounded-r-md' : ''
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <button className="flex items-center py-2 px-3 bg-amber-500 text-gray-900 rounded hover:bg-amber-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* TradingView Symbol Info Widget */}
      <div className="mb-4">
        <TradingViewSymbolInfo />
      </div>
      {/* TradingView Advanced Chart Widget */}
      <div className="mb-4">
        <TradingViewAdvancedChart />
      </div>
      {/* TradingView Technical Analysis & Economic Calendar Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <TradingViewTechnicalAnalysis />
        <TradingViewEconomicCalendar />
      </div>
      {/* TradingView News Widget */}
      <div className="mb-4">
        <TradingViewNews />
      </div>

      {/* Retain custom indicators, correlations, and support/resistance for context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((indicator) => (
          <div key={indicator.name} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="text-gray-400 text-sm">{indicator.name}</div>
              <div className={`flex items-center ${
                indicator.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {indicator.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{indicator.value}</div>
            <div className={`text-sm ${
              indicator.isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {indicator.isPositive ? '+' : ''}{indicator.change}
            </div>
          </div>
        ))}
      </div>

      {/* Wrap the following adjacent elements in a fragment to fix JSX error */}
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Correlations</h2>
              <div className="space-y-3">
                {correlations.map((corr) => (
                  <div key={corr.asset} className="flex items-center justify-between">
                    <span className="text-gray-300">{corr.asset}</span>
                    <div className={`px-2 py-1 rounded text-xs ${
                      Math.abs(corr.value) >= 0.5
                        ? corr.value > 0 
                          ? 'bg-green-500 bg-opacity-20 text-green-400'
                          : 'bg-red-500 bg-opacity-20 text-red-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {corr.value > 0 ? '+' : ''}{corr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Support & Resistance Grid Card (Real-Time) */}
        <div className="bg-gray-800 rounded-lg p-4 mt-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Support & Resistance</h2>
          {srLoading && (
            <div className="text-gray-400 text-center py-4">Loading technical analysis...</div>
          )}
          {srError && (
            <div className="text-red-500 text-center py-4">{srError}</div>
          )}
          {!srLoading && !srError && (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">Strong Resistance</div>
                <div className="text-white font-medium">{levels.strongResistance ?? '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Weak Resistance</div>
                <div className="text-white font-medium">{levels.weakResistance ?? '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Weak Support</div>
                <div className="text-white font-medium">{levels.weakSupport ?? '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Strong Support</div>
                <div className="text-white font-medium">{levels.strongSupport ?? '-'}</div>
              </div>
            </div>
          )}
        </div>
      </>

    </div>
  );
};

export default MarketData;