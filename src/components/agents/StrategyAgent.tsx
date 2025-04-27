import React from 'react';
import StrategyCard from '../widgets/StrategyCard';
import SummaryCard from '../widgets/SummaryCard';
import { useNewsSentiment } from '../../hooks/useNewsSentiment';
import { useForexData } from '../../hooks/useForexData';
import { detectPatterns } from '../../utils/patternDetection';
import { PatternDetection, NewsSentiment, Strategy } from '../../types';
import { Zap, RefreshCw, Filter } from 'lucide-react';

const StrategyAgent: React.FC = () => {
  // ...existing real-time data hooks and pattern detection logic...
  function generateStrategies(patterns: PatternDetection[], news: NewsSentiment[]): Strategy[] {
    const strategies = [];
    // Example: Bullish pattern + positive news
    const bullishPatterns = patterns.filter(p => p.direction === 'bullish' && p.confidence > 0.75);
    const positiveNews = news.filter(n => n.sentiment === 'positive' && n.impact === 'high');
    if (bullishPatterns.length && positiveNews.length) {
      strategies.push({
        id: 'bullish-combo',
        name: 'Pattern + News Bullish',
        description: `Strong bullish pattern(s) (${bullishPatterns.map(p => p.pattern).join(', ')}) and positive news detected: ${positiveNews[0].title}`,
        entryConditions: ['Bullish technical pattern detected', 'High-impact positive news sentiment'],
        exitConditions: ['Pattern invalidated', 'Negative news emerges'],
        stopLoss: 1.2,
        takeProfit: 2.5,
        timeframe: '1D',
        riskReward: 2.1,
        expectedWinRate: 0.6
      });
    }
    // Bearish pattern + negative news
    const bearishPatterns = patterns.filter(p => p.direction === 'bearish' && p.confidence > 0.75);
    const negativeNews = news.filter(n => n.sentiment === 'negative' && n.impact === 'high');
    if (bearishPatterns.length && negativeNews.length) {
      strategies.push({
        id: 'bearish-combo',
        name: 'Pattern + News Bearish',
        description: `Strong bearish pattern(s) (${bearishPatterns.map(p => p.pattern).join(', ')}) and negative news detected: ${negativeNews[0].title}`,
        entryConditions: ['Bearish technical pattern detected', 'High-impact negative news sentiment'],
        exitConditions: ['Pattern invalidated', 'Positive news emerges'],
        stopLoss: 1.5,
        takeProfit: 3.0,
        timeframe: '1D',
        riskReward: 2.0,
        expectedWinRate: 0.55
      });
    }
    // Fallback: show top pattern-based strategies
    if (!strategies.length && patterns.length) {
      strategies.push(...patterns.slice(0, 2).map((p, i) => ({
        id: `pattern-strategy-${i}`,
        name: `${p.pattern} Strategy`,
        description: `Trade based on detected pattern: ${p.pattern}`,
        entryConditions: [p.description],
        exitConditions: ['Pattern invalidated'],
        stopLoss: 1.0,
        takeProfit: 2.0,
        timeframe: p.timeframe,
        riskReward: 2.0,
        expectedWinRate: 0.5 + 0.2 * p.confidence
      })));
    }
    // Fallback: show top news-based strategies
    if (!strategies.length && news.length) {
      strategies.push(...news.slice(0, 2).map((n, i) => ({
        id: `news-strategy-${i}`,
        name: `News Sentiment ${n.sentiment === 'positive' ? 'Bullish' : n.sentiment === 'negative' ? 'Bearish' : 'Neutral'}`,
        description: `Trade based on high-impact news: ${n.title}`,
        entryConditions: [n.summary],
        exitConditions: ['Sentiment reverses'],
        stopLoss: 1.0,
        takeProfit: 2.0,
        timeframe: '1D',
        riskReward: 2.0,
        expectedWinRate: 0.5
      })));
    }
    return strategies;
  }
  // Real-time news sentiment
  const { news: newsSentiments, loading: newsLoading, error: newsError } = useNewsSentiment(10, 10);
  // Real-time pattern detection
  const { historicalData, loading: candlesLoading, error: candlesError } = useForexData(60000, '1day', 60);
  const [patternDetections, setPatternDetections] = React.useState<PatternDetection[]>([]);
  React.useEffect(() => {
    if (historicalData && Array.isArray(historicalData)) {
      const candles = historicalData.map((c: any) => ({
        date: c.datetime || c.date,
        open: parseFloat(c.open),
        high: parseFloat(c.high),
        low: parseFloat(c.low),
        close: parseFloat(c.close),
        volume: c.volume ? parseFloat(c.volume) : undefined
      }));
      setPatternDetections(detectPatterns(candles, '1D'));
    }
  }, [historicalData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Strategy Generation</h1>
          <p className="text-gray-400">
            AI-generated trading strategies based on patterns and sentiment
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center py-2 px-3 bg-gray-800 text-white rounded hover:bg-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </button>
          <button className="flex items-center py-2 px-3 bg-amber-500 text-gray-900 rounded hover:bg-amber-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Generate New</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-4 h-full">
            <h3 className="text-lg font-semibold mb-4 text-white">Strategy Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Technical Patterns</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  {patternDetections.slice(0, 3).map(pattern => (
                    <li key={pattern.id} className="flex justify-between items-center">
                      <span>{pattern.pattern}</span>
                      <span className={`text-xs ${
                        pattern.direction === 'bullish' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {pattern.direction} ({(pattern.confidence * 100).toFixed(0)}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">News Sentiment</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  {newsSentiments.slice(0, 3).map(news => (
                    <li key={news.id} className="flex justify-between items-center">
                      <span className="truncate pr-3">{news.title}</span>
                      <span className={`text-xs ${
                        news.sentiment === 'positive' ? 'text-green-500' : 
                        news.sentiment === 'negative' ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {news.sentiment}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-gray-700 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Strategy Parameters</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Risk/Reward Min</div>
                  <div className="text-white font-medium">1.5</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Max Risk</div>
                  <div className="text-white font-medium">2%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Win Rate Target</div>
                  <div className="text-white font-medium">60%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Timeframe</div>
                  <div className="text-white font-medium">1D</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SummaryCard title="Generated Strategy Stats">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Total Strategies:</span>
              <span className="font-medium">{generateStrategies(patternDetections, newsSentiments).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Risk/Reward:</span>
              <span className="font-medium">
                {(() => {
                  const strategies = generateStrategies(patternDetections, newsSentiments);
                  if (!strategies.length) return '0.0';
                  return (strategies.reduce((sum: number, s) => sum + s.riskReward, 0) / strategies.length).toFixed(1);
                })()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Win Rate:</span>
              <span className="font-medium">
                {(() => {
                  const strategies = generateStrategies(patternDetections, newsSentiments);
                  if (!strategies.length) return '0%';
                  return ((strategies.reduce((sum: number, s) => sum + s.expectedWinRate, 0) / strategies.length) * 100).toFixed(0) + '%';
                })()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Best Strategy:</span>
              <span className="font-medium text-amber-500">{(() => {
                const strategies = generateStrategies(patternDetections, newsSentiments);
                if (!strategies.length) return 'N/A';
                // Just pick the highest win rate
                const best = strategies.reduce((prev, curr) => curr.expectedWinRate > prev.expectedWinRate ? curr : prev, strategies[0]);
                return best.name;
              })()}</span>
            </div>
            <div className="h-px bg-gray-700 my-3"></div>
            <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-2">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-amber-500 mr-2" />
                <h4 className="text-sm font-medium text-amber-500">System Recommendation</h4>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Based on current market conditions, the {(() => {
                  const strategies = generateStrategies(patternDetections, newsSentiments);
                  if (!strategies.length) return 'N/A';
                  // Just pick the highest win rate
                  const best = strategies.reduce((prev, curr) => curr.expectedWinRate > prev.expectedWinRate ? curr : prev, strategies[0]);
                  return best.name;
                })()} strategy has the highest probability of success.
              </p>
            </div>
          </div>
        </SummaryCard>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Generated Strategies</h2>
        {(candlesLoading || newsLoading) ? (
          <div className="flex justify-center items-center py-8">
            <span className="text-gray-400 animate-pulse">Loading strategies...</span>
          </div>
        ) : (candlesError || newsError) ? (
          <div className="flex justify-center items-center py-8">
            <span className="text-red-500">Failed to load data. Please try again later.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generateStrategies(patternDetections, newsSentiments).map(strategy => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyAgent;