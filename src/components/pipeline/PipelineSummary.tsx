import React from 'react';
import MetricsCard from '../widgets/MetricsCard';
import SummaryCard from '../widgets/SummaryCard';

export interface NewsSummaryProps {
  newsResults: any[];
}

export const NewsSummary: React.FC<NewsSummaryProps> = ({ newsResults }) => {
  if (!newsResults || !Array.isArray(newsResults) || newsResults.length === 0) return null;
  const total = newsResults.length;
  const positive = newsResults.filter(n => n.sentiment === 'positive').length;
  const negative = newsResults.filter(n => n.sentiment === 'negative').length;
  const avgScore = (newsResults.reduce((sum, n) => sum + (n.score || 0), 0) / total).toFixed(2);
  const topImpact = newsResults.filter(n => n.impact === 'high').slice(0, 2);

  return (
    <SummaryCard title="News Sentiment Summary">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricsCard title="Articles" value={String(total)} icon="target" />
        <MetricsCard title="Positive" value={String(positive)} icon="award" isPositive />
        <MetricsCard title="Negative" value={String(negative)} icon="award" isPositive={false} />
        <MetricsCard title="Avg. Score" value={avgScore} icon="chart" />
      </div>
      <div className="mb-2">
        <span className="font-medium text-white">Top Headlines:</span>
        <ul className="list-disc ml-5 mt-1">
          {topImpact.map((n, i) => (
            <li key={i} className="text-sm text-gray-300 mb-1">
              <span className={n.sentiment === 'positive' ? 'text-green-400' : n.sentiment === 'negative' ? 'text-red-400' : 'text-gray-400'}>
                {n.title} ({n.impact} impact)
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2 text-xs text-amber-300">
        Recent news sentiment for XAUUSD is <span className="font-semibold">{positive > negative ? 'mostly positive' : negative > positive ? 'mostly negative' : 'mixed'}</span>. High-impact headlines include {topImpact.map(n => n.title).join(', ')}.
      </div>
    </SummaryCard>
  );
};

export interface BacktestSummaryProps {
  backtestResults: any[];
}

export const BacktestSummary: React.FC<BacktestSummaryProps> = ({ backtestResults }) => {
  if (!backtestResults || !Array.isArray(backtestResults) || backtestResults.length === 0) return null;
  // Pick best strategy by win rate
  const best = backtestResults.reduce((a, b) => (a.winRate > b.winRate ? a : b));
  const totalProfit = best.finalBalance - best.initialBalance;
  const percentReturn = ((totalProfit / best.initialBalance) * 100).toFixed(2);
  return (
    <SummaryCard title="Backtest Evaluation Summary">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricsCard title="Best Strategy" value={best.strategyId} icon="award" />
        <MetricsCard title="Profit" value={`$${totalProfit.toFixed(2)}`} icon="chart" isPositive={totalProfit >= 0} />
        <MetricsCard title="Win Rate" value={`${(best.winRate * 100).toFixed(0)}%`} icon="target" />
        <MetricsCard title="Sharpe Ratio" value={String(best.sharpeRatio)} icon="chart" />
      </div>
      <div className="mb-2 text-xs text-gray-300">
        Period: {best.startDate} to {best.endDate} | Trades: {best.totalTrades}
      </div>
      <div className="mt-2 text-xs text-amber-300">
        Your best strategy ({best.strategyId}) would have produced a <span className={totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}>{percentReturn}% {totalProfit >= 0 ? 'gain' : 'loss'}</span> over the last backtest period, with a win rate of {(best.winRate * 100).toFixed(0)}%. This suggests the system is {best.winRate > 0.5 ? 'robust' : 'in need of improvement'} under recent market conditions.
      </div>
    </SummaryCard>
  );
};
