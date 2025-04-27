import React from 'react';

import PipelineSummaryCard from './PipelineSummaryCard';

export const NewsTextSummary: React.FC<{ newsResults: any[] }> = ({ newsResults }) => {
  if (!newsResults || !Array.isArray(newsResults) || newsResults.length === 0) return null;
  const total = newsResults.length;
  const positive = newsResults.filter(n => n.sentiment === 'positive').length;
  const negative = newsResults.filter(n => n.sentiment === 'negative').length;
  const topImpact = newsResults.filter(n => n.impact === 'high').slice(0, 2);

  return (
    <PipelineSummaryCard title="News Sentiment Summary">
      {total} articles analyzed. {positive > negative ? 'Mostly positive' : negative > positive ? 'Mostly negative' : 'Mixed'} sentiment for XAUUSD. High-impact headlines: {topImpact.map(n => n.title).join(', ') || 'None'}.
    </PipelineSummaryCard>
  );
};

export const PatternTextSummary: React.FC<{ patternResult: any }> = ({ patternResult }) => {
  if (!patternResult || !patternResult.patterns || patternResult.patterns.length === 0) return null;
  const { patterns } = patternResult;
  return (
    <PipelineSummaryCard title="Pattern Detection Summary">
      {patterns.length} technical patterns detected. {patterns.map((p: any) => p.name).join(', ')}.
    </PipelineSummaryCard>
  );
};

export const StrategyTextSummary: React.FC<{ strategyResult: any }> = ({ strategyResult }) => {
  if (!strategyResult || !strategyResult.strategies || strategyResult.strategies.length === 0) return null;
  const { strategies } = strategyResult;
  return (
    <PipelineSummaryCard title="Strategy Generation Summary">
      {strategies.length} trading strategies generated. {strategies.map((s: any) => s.name || s.id).join(', ')}.
    </PipelineSummaryCard>
  );
};

export const BacktestTextSummary: React.FC<{ backtestResults: any[] }> = ({ backtestResults }) => {
  if (!backtestResults || !Array.isArray(backtestResults) || backtestResults.length === 0) return null;
  const best = backtestResults.reduce((a, b) => (a.winRate > b.winRate ? a : b));
  const totalProfit = best.finalBalance - best.initialBalance;
  const percentReturn = ((totalProfit / best.initialBalance) * 100).toFixed(2);
  return (
    <PipelineSummaryCard title="Backtest Evaluation Summary">
      Best strategy ({best.strategyId}) produced a {percentReturn}% {totalProfit >= 0 ? 'gain' : 'loss'} over the last period, win rate {(best.winRate * 100).toFixed(0)}%.
    </PipelineSummaryCard>
  );
};
