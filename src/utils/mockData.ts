import { 
  NewsSentiment,
  PatternDetection,
  Strategy,
  BacktestResult,
  Candle,
  Trade,
  PipelineStatus,
  AgentConfig
} from '../types';

// Mock XAUUSD candle data
export const mockCandleData: Candle[] = [
  { date: '2023-01-01', open: 1830.45, high: 1842.50, close: 1838.20, low: 1828.30, volume: 154230 },
  { date: '2023-01-02', open: 1838.20, high: 1848.75, close: 1845.60, low: 1836.40, volume: 162450 },
  { date: '2023-01-03', open: 1845.60, high: 1855.30, close: 1850.70, low: 1844.20, volume: 178690 },
  { date: '2023-01-04', open: 1850.70, high: 1862.45, close: 1857.90, low: 1849.50, volume: 192340 },
  { date: '2023-01-05', open: 1857.90, high: 1868.30, close: 1862.10, low: 1855.60, volume: 186570 },
  { date: '2023-01-06', open: 1862.10, high: 1866.80, close: 1865.40, low: 1858.90, volume: 165480 },
  { date: '2023-01-07', open: 1865.40, high: 1878.25, close: 1875.60, low: 1864.70, volume: 198730 },
  { date: '2023-01-08', open: 1875.60, high: 1882.50, close: 1878.30, low: 1873.40, volume: 176520 },
  { date: '2023-01-09', open: 1878.30, high: 1885.70, close: 1880.90, low: 1877.20, volume: 183690 },
  { date: '2023-01-10', open: 1880.90, high: 1892.40, close: 1888.60, low: 1879.50, volume: 215470 },
  { date: '2023-01-11', open: 1888.60, high: 1895.30, close: 1890.80, low: 1886.70, volume: 203680 },
  { date: '2023-01-12', open: 1890.80, high: 1896.40, close: 1892.20, low: 1887.90, volume: 195230 },
  { date: '2023-01-13', open: 1892.20, high: 1899.70, close: 1897.50, low: 1891.40, volume: 208450 },
  { date: '2023-01-14', open: 1897.50, high: 1903.80, close: 1900.30, low: 1895.60, volume: 223680 },
  { date: '2023-01-15', open: 1900.30, high: 1909.40, close: 1905.70, low: 1899.20, volume: 245790 },
  { date: '2023-01-16', open: 1905.70, high: 1912.30, close: 1908.50, low: 1903.80, volume: 234560 },
  { date: '2023-01-17', open: 1908.50, high: 1915.80, close: 1910.20, low: 1906.40, volume: 218730 },
  { date: '2023-01-18', open: 1910.20, high: 1918.50, close: 1916.70, low: 1909.30, volume: 232450 },
  { date: '2023-01-19', open: 1916.70, high: 1922.40, close: 1920.80, low: 1915.20, volume: 251680 },
  { date: '2023-01-20', open: 1920.80, high: 1928.30, close: 1926.50, low: 1919.40, volume: 267890 },
  { date: '2023-01-21', open: 1926.50, high: 1932.70, close: 1929.40, low: 1925.30, volume: 248760 },
  { date: '2023-01-22', open: 1929.40, high: 1935.20, close: 1933.80, low: 1927.90, volume: 236540 },
  { date: '2023-01-23', open: 1933.80, high: 1938.50, close: 1935.60, low: 1931.70, volume: 225680 },
  { date: '2023-01-24', open: 1935.60, high: 1940.80, close: 1938.20, low: 1934.30, volume: 218970 },
  { date: '2023-01-25', open: 1938.20, high: 1944.50, close: 1941.70, low: 1937.40, volume: 232450 },
  { date: '2023-01-26', open: 1941.70, high: 1948.30, close: 1945.90, low: 1940.20, volume: 245680 },
  { date: '2023-01-27', open: 1945.90, high: 1952.40, close: 1949.30, low: 1944.80, volume: 256790 },
  { date: '2023-01-28', open: 1949.30, high: 1956.70, close: 1954.20, low: 1948.50, volume: 267840 },
  { date: '2023-01-29', open: 1954.20, high: 1960.40, close: 1957.80, low: 1952.60, volume: 278950 },
  { date: '2023-01-30', open: 1957.80, high: 1964.30, close: 1962.50, low: 1956.90, volume: 289760 }
];

// Mock news sentiment data
export const mockNewsSentiments: NewsSentiment[] = [
  {
    id: '1',
    title: 'Fed Signals Potential Rate Cut',
    source: 'Bloomberg',
    date: '2023-01-28',
    sentiment: 'positive',
    score: 0.82,
    impact: 'high',
    summary: 'Federal Reserve hints at potential rate cuts in the next meeting, increasing demand for gold as a hedge against inflation.'
  },
  {
    id: '2',
    title: 'Rising Inflation Concerns',
    source: 'Reuters',
    date: '2023-01-27',
    sentiment: 'positive',
    score: 0.75,
    impact: 'high',
    summary: 'CPI data shows inflation rising faster than expected, increasing demand for inflation hedges like gold.'
  },
  {
    id: '3',
    title: 'Dollar Strength Pressures Gold',
    source: 'Financial Times',
    date: '2023-01-25',
    sentiment: 'negative',
    score: -0.65,
    impact: 'medium',
    summary: 'USD index reaches 3-month high, putting pressure on dollar-denominated assets like gold.'
  },
  {
    id: '4',
    title: 'Geopolitical Tensions Escalate',
    source: 'CNN',
    date: '2023-01-23',
    sentiment: 'positive',
    score: 0.68,
    impact: 'medium',
    summary: 'Rising tensions in Eastern Europe increase safe-haven demand for gold.'
  },
  {
    id: '5',
    title: 'Central Banks Increase Gold Reserves',
    source: 'WSJ',
    date: '2023-01-20',
    sentiment: 'positive',
    score: 0.79,
    impact: 'high',
    summary: 'Multiple central banks reported increasing their gold reserves, showing confidence in the asset.'
  }
];

// Mock pattern detections
export const mockPatternDetections: PatternDetection[] = [
  {
    id: '1',
    pattern: 'Double Bottom',
    timeframe: '4H',
    confidence: 0.89,
    direction: 'bullish',
    detectedAt: '2023-01-28',
    description: 'Clear double bottom formation with confirmation of trend reversal',
    historicalAccuracy: 0.82
  },
  {
    id: '2',
    pattern: 'Head and Shoulders',
    timeframe: '1D',
    confidence: 0.72,
    direction: 'bearish',
    detectedAt: '2023-01-25',
    description: 'Developing head and shoulders pattern indicating potential reversal of uptrend',
    historicalAccuracy: 0.78
  },
  {
    id: '3',
    pattern: 'Bull Flag',
    timeframe: '1H',
    confidence: 0.85,
    direction: 'bullish',
    detectedAt: '2023-01-27',
    description: 'Bull flag pattern forming after strong uptrend, suggesting continuation',
    historicalAccuracy: 0.75
  },
  {
    id: '4',
    pattern: 'Golden Cross',
    timeframe: '1D',
    confidence: 0.94,
    direction: 'bullish',
    detectedAt: '2023-01-26',
    description: '50-day MA crossing above 200-day MA, signaling strong bullish momentum',
    historicalAccuracy: 0.88
  },
  {
    id: '5',
    pattern: 'Descending Triangle',
    timeframe: '4H',
    confidence: 0.68,
    direction: 'bearish',
    detectedAt: '2023-01-24',
    description: 'Descending triangle forming with lower highs against horizontal support',
    historicalAccuracy: 0.71
  }
];

// Mock strategies
export const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Golden Cross Momentum',
    description: 'Buy when 50-day MA crosses above 200-day MA with increasing volume',
    entryConditions: [
      '50-day MA crosses above 200-day MA',
      'Volume increasing over 5-day average',
      'RSI > 50'
    ],
    exitConditions: [
      '50-day MA crosses below 200-day MA',
      'RSI < 30',
      'Price hits take profit target'
    ],
    stopLoss: 1.5,
    takeProfit: 3.0,
    timeframe: '1D',
    riskReward: 2.0,
    expectedWinRate: 0.65
  },
  {
    id: '2',
    name: 'News Sentiment Reversal',
    description: 'Enter counter-trend positions based on extreme news sentiment scores',
    entryConditions: [
      'News sentiment score > 0.8 or < -0.8',
      'Oversold/Overbought conditions (RSI < 30 or > 70)',
      'At least 3 news articles with similar sentiment'
    ],
    exitConditions: [
      'News sentiment neutralizes',
      'Price reaches key resistance/support',
      'RSI crosses 50 level'
    ],
    stopLoss: 1.2,
    takeProfit: 2.5,
    timeframe: '4H',
    riskReward: 2.0,
    expectedWinRate: 0.6
  },
  {
    id: '3',
    name: 'Pattern-Based Breakout',
    description: 'Enter on breakouts from high-confidence chart patterns',
    entryConditions: [
      'Pattern detection confidence > 80%',
      'Breakout from pattern boundary',
      'Increasing volume on breakout'
    ],
    exitConditions: [
      'Price target based on pattern measurement',
      'Reversal pattern forms',
      'Volume decreases significantly'
    ],
    stopLoss: 1.0,
    takeProfit: 2.5,
    timeframe: '1D',
    riskReward: 2.5,
    expectedWinRate: 0.58
  }
];

// Mock trades
const generateTrades = (strategyId: string, count: number): Trade[] => {
  const trades: Trade[] = [];
  const baseDate = new Date('2023-01-01');
  
  for (let i = 0; i < count; i++) {
    const entryDate = new Date(baseDate);
    entryDate.setDate(baseDate.getDate() + i);
    
    const exitDate = new Date(entryDate);
    exitDate.setDate(entryDate.getDate() + 2);
    
    const direction = Math.random() > 0.5 ? 'long' : 'short';
    const entryPrice = 1800 + Math.random() * 200;
    const exitPriceDiff = (Math.random() * 20) * (Math.random() > 0.65 ? 1 : -1);
    const exitPrice = direction === 'long' 
      ? entryPrice + exitPriceDiff 
      : entryPrice - exitPriceDiff;
    
    const profit = direction === 'long' 
      ? exitPrice - entryPrice 
      : entryPrice - exitPrice;
    
    trades.push({
      id: `trade-${strategyId}-${i}`,
      entryDate: entryDate.toISOString().split('T')[0],
      entryPrice,
      exitDate: exitDate.toISOString().split('T')[0],
      exitPrice,
      direction,
      profit,
      profitPercentage: (profit / entryPrice) * 100,
      stopLoss: entryPrice * 0.99,
      takeProfit: entryPrice * 1.02
    });
  }
  
  return trades;
};

// Mock backtest results
export const mockBacktestResults: BacktestResult[] = [
  {
    id: '1',
    strategyId: '1',
    startDate: '2023-01-01',
    endDate: '2023-01-30',
    initialBalance: 10000,
    finalBalance: 12456,
    totalTrades: 15,
    winningTrades: 10,
    losingTrades: 5,
    winRate: 0.67,
    profitFactor: 2.3,
    maxDrawdown: 8.2,
    sharpeRatio: 1.8,
    averageTrade: 163.73,
    trades: generateTrades('1', 15)
  },
  {
    id: '2',
    strategyId: '2',
    startDate: '2023-01-01',
    endDate: '2023-01-30',
    initialBalance: 10000,
    finalBalance: 11245,
    totalTrades: 22,
    winningTrades: 13,
    losingTrades: 9,
    winRate: 0.59,
    profitFactor: 1.8,
    maxDrawdown: 12.4,
    sharpeRatio: 1.4,
    averageTrade: 56.59,
    trades: generateTrades('2', 22)
  },
  {
    id: '3',
    strategyId: '3',
    startDate: '2023-01-01',
    endDate: '2023-01-30',
    initialBalance: 10000,
    finalBalance: 13567,
    totalTrades: 8,
    winningTrades: 5,
    losingTrades: 3,
    winRate: 0.63,
    profitFactor: 2.7,
    maxDrawdown: 7.6,
    sharpeRatio: 2.1,
    averageTrade: 445.88,
    trades: generateTrades('3', 8)
  }
];

// Mock pipeline status
export const mockPipelineStatus: PipelineStatus = {
  newsAgent: 'completed',
  patternAgent: 'completed',
  strategyAgent: 'running',
  evaluationAgent: 'idle',
  lastRun: '2023-01-30T08:45:30Z',
  currentStage: 'Generating strategy recommendations',
  progress: 65
};

// Mock agent configurations
export const mockAgentConfigs: AgentConfig[] = [
  {
    id: 'newsAgent',
    name: 'News Sentiment Analysis Agent',
    description: 'Analyzes financial news to determine impact on XAUUSD',
    enabled: true,
    parameters: {
      sources: ['Bloomberg', 'Reuters', 'Financial Times', 'WSJ', 'CNN'],
      lookbackDays: 7,
      minArticles: 5,
      relevanceThreshold: 0.7
    }
  },
  {
    id: 'patternAgent',
    name: 'Technical Pattern Detection Agent',
    description: 'Identifies chart patterns and technical signals',
    enabled: true,
    parameters: {
      timeframes: ['1H', '4H', '1D'],
      minConfidence: 0.65,
      patterns: ['Double Bottom', 'Double Top', 'Head and Shoulders', 'Inverse Head and Shoulders', 'Triangle', 'Flag', 'Golden Cross', 'Death Cross']
    }
  },
  {
    id: 'strategyAgent',
    name: 'Trading Strategy Agent',
    description: 'Generates trading strategies based on patterns and news',
    enabled: true,
    parameters: {
      riskRewardMinimum: 1.5,
      maxRiskPerTrade: 2,
      useNewsData: true,
      useTechnicalPatterns: true,
      maxStrategiesGenerated: 5
    }
  },
  {
    id: 'evaluationAgent',
    name: 'Backtest Evaluation Agent',
    description: 'Evaluates strategy performance through backtesting',
    enabled: true,
    parameters: {
      defaultPeriod: 30,
      initialBalance: 10000,
      considerSpread: true,
      commission: 0.1,
      slippage: 0.05
    }
  }
];