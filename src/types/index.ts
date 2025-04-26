// Type definitions for the trading bot application

// Agent status types
export type AgentStatus = 'idle' | 'running' | 'completed' | 'error';

// News sentiment types
export interface NewsSentiment {
  id: string;
  title: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  impact: 'high' | 'medium' | 'low';
  summary: string;
}

// Pattern detection types
export interface PatternDetection {
  id: string;
  pattern: string;
  timeframe: string;
  confidence: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  detectedAt: string;
  description: string;
  historicalAccuracy: number;
}

// Strategy types
export interface Strategy {
  id: string;
  name: string;
  description: string;
  entryConditions: string[];
  exitConditions: string[];
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  riskReward: number;
  expectedWinRate: number;
}

// Backtest result types
export interface BacktestResult {
  id: string;
  strategyId: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  averageTrade: number;
  trades: Trade[];
}

export interface Trade {
  id: string;
  entryDate: string;
  entryPrice: number;
  exitDate: string;
  exitPrice: number;
  direction: 'long' | 'short';
  profit: number;
  profitPercentage: number;
  stopLoss: number;
  takeProfit: number;
}

// Candlestick data type
export interface Candle {
  date: string;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

// Agent configuration types
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  parameters: Record<string, any>;
}

// Pipeline status
export interface PipelineStatus {
  newsAgent: AgentStatus;
  patternAgent: AgentStatus;
  strategyAgent: AgentStatus;
  evaluationAgent: AgentStatus;
  lastRun: string | null;
  currentStage: string | null;
  progress: number;
}