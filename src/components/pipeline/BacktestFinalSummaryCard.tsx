import React from 'react';
import PipelineSummaryCard from './PipelineSummaryCard';

interface BacktestFinalSummaryCardProps {
  newsResults: any[];
  patternResult: any;
  strategyResult: any;
  backtestResults: any[];
}

function getMarketBias(newsResults: any[], patternResult: any, strategyResult: any): 'bullish' | 'bearish' | 'neutral' {
  // Simple aggregation logic: majority rules
  let score = 0;
  if (newsResults && newsResults.length) {
    const pos = newsResults.filter(n => n.sentiment === 'positive').length;
    const neg = newsResults.filter(n => n.sentiment === 'negative').length;
    if (pos > neg) score++;
    else if (neg > pos) score--;
  }
  if (patternResult && patternResult.patterns && patternResult.patterns.length) {
    const bullish = patternResult.patterns.filter((p: any) => p.direction === 'bullish').length;
    const bearish = patternResult.patterns.filter((p: any) => p.direction === 'bearish').length;
    if (bullish > bearish) score++;
    else if (bearish > bullish) score--;
  }
  if (strategyResult && strategyResult.strategies && strategyResult.strategies.length) {
    const bullish = strategyResult.strategies.filter((s: any) => (s.direction || '').toLowerCase() === 'long').length;
    const bearish = strategyResult.strategies.filter((s: any) => (s.direction || '').toLowerCase() === 'short').length;
    if (bullish > bearish) score++;
    else if (bearish > bullish) score--;
  }
  if (score > 0) return 'bullish';
  if (score < 0) return 'bearish';
  return 'neutral';
}

const BacktestFinalSummaryCard: React.FC<BacktestFinalSummaryCardProps> = ({ newsResults, patternResult, strategyResult, backtestResults }) => {
  if (!backtestResults || !Array.isArray(backtestResults) || backtestResults.length === 0) return null;
  const best = backtestResults.reduce((a, b) => (a.winRate > b.winRate ? a : b));
  const totalProfit = best.finalBalance - best.initialBalance;
  const percentReturn = ((totalProfit / best.initialBalance) * 100).toFixed(2);
  const bias = getMarketBias(newsResults, patternResult, strategyResult);
  let action = 'Hold';
  if (bias === 'bullish') action = 'Buy';
  else if (bias === 'bearish') action = 'Sell';

  return (
    <PipelineSummaryCard title="Backtest Final Strategy Plan">
      Best strategy ({best.strategyId}) produced a {percentReturn}% {totalProfit >= 0 ? 'gain' : 'loss'} over the last period, win rate {(best.winRate * 100).toFixed(0)}%.<br/>
      <span className="block mt-2 text-amber-300">Market bias: <b className={bias === 'bullish' ? 'text-green-400' : bias === 'bearish' ? 'text-red-400' : 'text-gray-400'}>{bias.toUpperCase()}</b> &mdash; Recommended action: <b className="text-white">{action}</b></span>
      <span className="block mt-1 text-xs text-gray-400">(Plan based on news, technical patterns, and strategy signals above.)</span>
    </PipelineSummaryCard>
  );
};

export default BacktestFinalSummaryCard;
