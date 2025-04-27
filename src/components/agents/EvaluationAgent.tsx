import React from 'react';
import { useTradeStore } from '../../store/useTradeStore';
import MetricsCard from '../widgets/MetricsCard';
import SummaryCard from '../widgets/SummaryCard';
import { Download, BarChart2 } from 'lucide-react';

const EvaluationAgent: React.FC = () => {
  const trades = useTradeStore((state) => state.trades);

  // Metrics calculations
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.profit > 0);
  const losses = trades.filter((t) => t.profit < 0);
  const winRate = totalTrades > 0 ? wins.length / totalTrades : 0;
  const profitFactor = losses.length > 0 ? (wins.reduce((sum, t) => sum + t.profit, 0) / Math.abs(losses.reduce((sum, t) => sum + t.profit, 0))) : (wins.length > 0 ? 999 : 0);
  const avgTrade = totalTrades > 0 ? trades.reduce((sum, t) => sum + t.profit, 0) / totalTrades : 0;
  // Statistics: Expectancy, Recovery Factor, Kelly
  const expectancy = avgTrade * winRate;
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.profit, 0));
  const initialBalance = 10000; // Could be user input
  const finalBalance = initialBalance + trades.reduce((sum, t) => sum + t.profit, 0);
  const recoveryFactor = grossLoss > 0 ? (finalBalance - initialBalance) / grossLoss : 0;
  const kellyPct = (winRate - ((1 - winRate) / (profitFactor > 0 ? profitFactor / winRate : 1))) || 0;
  // System Evaluation Summary
  let systemSummary = '';
  if (totalTrades === 0) {
    systemSummary = 'No trades added yet. Add trades to evaluate the system.';
  } else if (winRate > 0.6 && profitFactor > 1.5) {
    systemSummary = 'This strategy shows strong performance with good risk-adjusted returns.';
  } else if (winRate > 0.5 && profitFactor > 1) {
    systemSummary = 'This strategy is profitable but could be improved for better risk-adjusted returns.';
  } else {
    systemSummary = 'This strategy needs improvement. Review your trade criteria and risk management.';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Backtest Evaluation</h1>
        <p className="text-gray-400">
          Evaluating strategy performance through historical backtesting
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <MetricsCard 
          title="Win Rate" 
          value={`${(winRate * 100).toFixed(0)}%`} 
          icon="award" 
        />
        <MetricsCard 
          title="Profit Factor" 
          value={profitFactor.toFixed(2)} 
          icon="chart" 
        />
        <MetricsCard 
          title="Avg. Trade" 
          value={`$${avgTrade.toFixed(2)}`} 
          icon="chart" 
        />
        <MetricsCard 
          title="Total Trades" 
          value={`${totalTrades}`} 
          icon="target" 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-3">Trade Details</h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Entry Date</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Exit Date</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Direction</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Entry</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Exit</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {trades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 py-6">No trades added yet.</td>
                    </tr>
                  ) : (
                    trades.map((trade, index) => (
                      <tr key={trade.id} className="hover:bg-gray-750">
                        <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{trade.entryDate}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{trade.exitDate}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            trade.type === 'long' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">${trade.entry.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">${trade.exit.toFixed(2)}</td>
                        <td className={`px-4 py-3 text-sm font-medium ${
                          trade.profit >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-700 px-4 py-2 text-right">
              <button className="text-xs text-amber-500 hover:text-amber-400 flex items-center justify-end ml-auto">
                <Download className="h-3 w-3 mr-1" />
                Export All Trades
              </button>
            </div>
          </div>
        </div>
        <SummaryCard title="Performance Metrics">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <MetricsCard 
                title="Win Rate" 
                value={`${(winRate * 100).toFixed(0)}%`} 
                icon="award" 
              />
              <MetricsCard 
                title="Profit Factor" 
                value={profitFactor.toFixed(2)} 
                icon="chart" 
              />
              <MetricsCard 
                title="Avg. Trade" 
                value={`$${avgTrade.toFixed(2)}`} 
                icon="chart" 
              />
              <MetricsCard 
                title="Total Trades" 
                value={`${totalTrades}`} 
                icon="target" 
              />
            </div>
            <div className="h-px bg-gray-700 my-2"></div>
            <h4 className="text-sm font-medium text-white">Statistics</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Expectancy:</span>
                <span className="text-white">${expectancy.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recovery Factor:</span>
                <span className="text-white">{recoveryFactor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kelly Percentage:</span>
                <span className="text-white">{kellyPct.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-px bg-gray-700 my-2"></div>
            <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-2">
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 text-green-500 mr-2" />
                <h4 className="text-sm font-medium text-green-500">System Evaluation</h4>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {systemSummary}
              </p>
            </div>
          </div>
        </SummaryCard>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-white">Backtesting Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Testing Period</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">Start Date</label>
                <input 
                  type="date" 
                  value="2023-01-01"
                  className="mt-1 block w-full bg-gray-600 border-gray-600 rounded text-white text-sm px-2 py-1"
                  title="Start Date"
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">End Date</label>
                <input 
                  type="date" 
                  value="2023-01-30"
                  className="mt-1 block w-full bg-gray-600 border-gray-600 rounded text-white text-sm px-2 py-1"
                  title="End Date"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Account Settings</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400">Initial Balance</label>
                <input 
                  type="number" 
                  value="10000"
                  className="mt-1 block w-full bg-gray-600 border-gray-600 rounded text-white text-sm px-2 py-1"
                  title="Initial Balance"
                  placeholder="Initial Balance"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Commission (%)</label>
                <input 
                  type="number" 
                  value="0.1"
                  step="0.01"
                  className="mt-1 block w-full bg-gray-600 border-gray-600 rounded text-white text-sm px-2 py-1"
                  title="Commission Percentage"
                  placeholder="Commission (%)"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Advanced Settings</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" checked />
                <span className="text-sm">Consider Slippage</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" checked />
                <span className="text-sm">Use Real Spread Data</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Monte Carlo Simulation</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="py-2 px-4 bg-amber-500 text-gray-900 rounded font-medium text-sm hover:bg-amber-600 transition-colors">
            Run Backtest
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationAgent;