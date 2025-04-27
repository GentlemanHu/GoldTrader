import { PatternDetection, NewsSentiment, Strategy } from '../types';

// This function is directly adapted from StrategyAgent.tsx
export function generateStrategies(patterns: PatternDetection[], news: NewsSentiment[]): Strategy[] {
  const strategies: Strategy[] = [];
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
