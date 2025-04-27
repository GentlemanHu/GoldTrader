import React, { useMemo } from 'react';
import PriceChart from '../charts/PriceChart';
import SentimentChart from '../charts/SentimentChart';
import BacktestResultChart from '../charts/BacktestResultChart';
import MetricsCard from '../widgets/MetricsCard';
import SummaryCard from '../widgets/SummaryCard';
import PatternCard from '../widgets/PatternCard';
import NewsCard from '../widgets/NewsCard';
import PipelineStatus from '../widgets/PipelineStatus';
import { useForexData } from '../../hooks/useForexData';
import { useNewsSentiment } from '../../hooks/useNewsSentiment';
import { detectPatterns } from '../../utils/patternDetection';
import { mockBacktestResults, mockPipelineStatus } from '../../utils/mockData';

const Dashboard: React.FC = () => {
  // Dashboard-level timeframe state for PriceChart
  const [timeframe, setTimeframe] = React.useState<string>('1D');
  const { historicalData, price, loading, error } = useForexData(30000); // Update every 30 seconds
  const { news, loading: newsLoading, error: newsError } = useNewsSentiment(5, 10);

  // Run pattern detection on latest candles
  const patterns = useMemo(() => {
    if (!historicalData || !Array.isArray(historicalData)) return [];
    return detectPatterns(historicalData, '1day').sort((a, b) => b.confidence - a.confidence);
  }, [historicalData]);

  // Calculate price changes
  const getPriceChanges = () => {
    if (!price) return { change: 0, changePercent: 0 };
    const prevPrice = price * 0.9975; // Simulated previous price for demo
    const change = price - prevPrice;
    const changePercent = (change / prevPrice) * 100;
    return { change, changePercent };
  };

  const { change, changePercent } = getPriceChanges();

  if (error) {
    console.error('Error fetching forex data:', error);
  }
  if (newsError) {
    console.error('Error fetching news sentiment:', newsError);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">Trading Dashboard</h1>
          <p className="text-gray-400 mb-6">
            Automated system for gold trading strategy generation and backtesting
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:place-self-end">
          <MetricsCard 
            title="Current Gold Price" 
            value={loading ? "Loading..." : price ? `$${price.toFixed(2)}` : "$0.00"}
            change={loading ? "" : `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`}
            isPositive={changePercent > 0}
            icon="chart"
          />
          <MetricsCard 
            title="Best Strategy" 
            value={`${(mockBacktestResults[2].winRate * 100).toFixed(0)}% Win Rate`}
            change="+24.5% ROI"
            isPositive={true}
            icon="award"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <PriceChart timeframe={timeframe} setTimeframe={setTimeframe} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricsCard 
          title="Total Backtests" 
          value="162"
          change="+12 this week"
          isPositive={true}
        />
        <MetricsCard 
          title="Avg. Strategy Win Rate" 
          value="64.2%"
          change="+5.3% vs. last month"
          isPositive={true}
        />
        <MetricsCard 
          title="Potential Profit" 
          value={loading ? "Loading..." : `$${(change * 100).toFixed(2)}`}
          change={loading ? "" : `${change > 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${changePercent.toFixed(1)}%)`}
          isPositive={change > 0}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Latest Pattern Detections</h2>
          <div className="grid grid-cols-1 gap-3">
            {loading ? (
              <div className="text-gray-400">Loading patterns...</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : patterns.length === 0 ? (
              <div className="text-gray-400">No patterns detected.</div>
            ) : (
              patterns.slice(0, 2).map(pattern => (
                <PatternCard key={pattern.id} pattern={pattern} />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Latest News Impact</h2>
          <div className="grid grid-cols-1 gap-3">
            {newsLoading ? (
              <div className="text-gray-400">Loading news...</div>
            ) : newsError ? (
              <div className="text-red-400">{newsError}</div>
            ) : news.length === 0 ? (
              <div className="text-gray-400">No news found.</div>
            ) : (
              news.slice(0, 2).map(item => (
                <NewsCard key={item.id} news={item} />
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BacktestResultChart result={mockBacktestResults[2]} />
        </div>
        
        <div>
          <PipelineStatus status={mockPipelineStatus} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentChart data={[]} />
        
        <SummaryCard title="System Summary">
          <p className="mb-2">
            The Auto-Backtest + Strategy Generation Bot is currently monitoring XAUUSD (Gold) with a primary focus on daily and 4-hour timeframes.
          </p>
          <p className="mb-2">
            Recent analysis indicates a <span className="text-green-500 font-medium">bullish bias</span> based on technical patterns and positive news sentiment.
          </p>
          <p>
            Top performing strategy "Pattern-Based Breakout" has demonstrated a <span className="text-amber-500 font-medium">63% win rate</span> with a risk-reward ratio of 2.5.
          </p>
        </SummaryCard>
      </div>
    </div>
  );
};

export default Dashboard;