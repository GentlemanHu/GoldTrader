import { Strategy, Trade, BacktestResult } from '../types';
import { mockCandleData } from './mockData';

// Simple backtest engine: applies each strategy to mock candle data and generates trades
export function evaluateStrategies(strategies: Strategy[]): BacktestResult[] {
  // For each strategy, simulate trades using mock candle data
  return strategies.map((strategy, i) => {
    // Simulate trades for this strategy
    const trades: Trade[] = mockCandleData.slice(0, 10).map((candle, j) => {
      const entry = candle.open;
      const direction = Math.random() > 0.5 ? 'long' : 'short';
      const rr = strategy.riskReward;
      const stopLoss = direction === 'long' ? entry - rr : entry + rr;
      const exit = direction === 'long' ? entry + rr * 2 : entry - rr * 2;
      const profit = direction === 'long' ? exit - entry : entry - exit;
      const takeProfit = typeof strategy.takeProfit === 'number' ? strategy.takeProfit : rr * 2;
      const profitPercentage = (profit / entry) * 100;
      return {
        id: `trade-${strategy.id}-${j}`,
        entryDate: candle.date,
        exitDate: candle.date,
        holdMs: 86400000,
        pair: 'XAUUSD',
        type: direction,
        entry,
        exit,
        stopLoss,
        lotSize: 1,
        profit,
        pips: profit,
        rr,
        strategy: strategy.name,
        notes: '',
        entryPrice: entry,
        exitPrice: exit,
        direction,
        profitPercentage,
        takeProfit
      };
    });
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.profit > 0).length;
    const losingTrades = trades.filter(t => t.profit < 0).length;
    const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0;
    const profitFactor = losingTrades > 0 ? (trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / Math.abs(trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0))) : (winningTrades > 0 ? 999 : 0);
    const averageTrade = totalTrades > 0 ? trades.reduce((sum, t) => sum + t.profit, 0) / totalTrades : 0;
    const initialBalance = 10000;
    const finalBalance = initialBalance + trades.reduce((sum, t) => sum + t.profit, 0);
    return {
      id: `${i}`,
      strategyId: strategy.id,
      startDate: mockCandleData[0].date,
      endDate: mockCandleData[9].date,
      initialBalance,
      finalBalance,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      profitFactor,
      maxDrawdown: 10,
      sharpeRatio: 1.5,
      averageTrade,
      trades
    };
  });
}
