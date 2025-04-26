import React from 'react';
import BacktestResultChart from '../charts/BacktestResultChart';
import MetricsCard from '../widgets/MetricsCard';
import SummaryCard from '../widgets/SummaryCard';
import { mockBacktestResults, mockStrategies } from '../../utils/mockData';
import { Calendar, Download, BarChart2, RefreshCw, Filter, AlertTriangle } from 'lucide-react';

const EvaluationAgent: React.FC = () => {
  // Get the best backtest result based on profit factor
  const bestResult = mockBacktestResults.reduce(
    (best, current) => (current.profitFactor > best.profitFactor ? current : best), 
    mockBacktestResults[0]
  );
  
  const getStrategyNameById = (id: string) => {
    const strategy = mockStrategies.find(s => s.id === id);
    return strategy ? strategy.name : 'Unknown Strategy';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Backtest Evaluation</h1>
          <p className="text-gray-400">
            Evaluating strategy performance through historical backtesting
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center py-2 px-3 bg-gray-800 text-white rounded hover:bg-gray-700">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Jan 1 - Jan 30, 2023</span>
          </button>
          <button className="flex items-center py-2 px-3 bg-amber-500 text-gray-900 rounded hover:bg-amber-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Run Backtest</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <MetricsCard 
          title="Best Strategy" 
          value={getStrategyNameById(bestResult.strategyId)}
          description={`${bestResult.winRate * 100}% Win Rate, ${bestResult.profitFactor.toFixed(1)} Profit Factor`}
          icon="award"
        />
        <MetricsCard 
          title="Total Return" 
          value={`$${(bestResult.finalBalance - bestResult.initialBalance).toFixed(2)}`}
          change={`+${((bestResult.finalBalance / bestResult.initialBalance - 1) * 100).toFixed(2)}%`}
          isPositive={bestResult.finalBalance > bestResult.initialBalance}
          icon="chart"
        />
        <MetricsCard 
          title="Max Drawdown" 
          value={`${bestResult.maxDrawdown.toFixed(2)}%`}
          description="Risk assessment: Moderate"
          isPositive={false}
          icon="target"
        />
        <MetricsCard 
          title="Sharpe Ratio" 
          value={bestResult.sharpeRatio.toFixed(2)}
          description="Above average risk-adjusted return"
          isPositive={bestResult.sharpeRatio > 1}
          icon="chart"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <BacktestResultChart result={bestResult} />
      </div>
      
      <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-4 flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
        <div>
          <h3 className="text-amber-500 font-medium">Evaluation Insight</h3>
          <p className="text-gray-300 text-sm">
            The Pattern-Based Breakout strategy performed best during high-volatility market conditions.
            Consider adjusting the stop loss to 1.2% to improve the risk-adjusted return even further.
          </p>
        </div>
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
                  {bestResult.trades.slice(0, 5).map((trade, index) => (
                    <tr key={trade.id} className="hover:bg-gray-750">
                      <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{trade.entryDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{trade.exitDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trade.direction === 'long' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                          {trade.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">${trade.entryPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">${trade.exitPrice.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${
                        trade.profit >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
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
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-xs text-gray-400">Win Rate</div>
                <div className="text-white font-medium">{(bestResult.winRate * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-xs text-gray-400">Profit Factor</div>
                <div className="text-white font-medium">{bestResult.profitFactor.toFixed(2)}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-xs text-gray-400">Avg. Trade</div>
                <div className="text-white font-medium">${bestResult.averageTrade.toFixed(2)}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-xs text-gray-400">Total Trades</div>
                <div className="text-white font-medium">{bestResult.totalTrades}</div>
              </div>
            </div>
            
            <div className="h-px bg-gray-700 my-2"></div>
            
            <h4 className="text-sm font-medium text-white">Statistics</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Expectancy:</span>
                <span className="text-white">${(bestResult.averageTrade * bestResult.winRate).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recovery Factor:</span>
                <span className="text-white">
                  {((bestResult.finalBalance - bestResult.initialBalance) / 
                    (bestResult.initialBalance * (bestResult.maxDrawdown / 100))).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kelly Percentage:</span>
                <span className="text-white">
                  {(bestResult.winRate - ((1 - bestResult.winRate) / 
                    (bestResult.profitFactor / bestResult.winRate))).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="h-px bg-gray-700 my-2"></div>
            
            <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-2">
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 text-green-500 mr-2" />
                <h4 className="text-sm font-medium text-green-500">System Evaluation</h4>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                This strategy shows strong performance with good risk-adjusted returns.
                Recommended position size: 2% of capital per trade.
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
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">End Date</label>
                <input 
                  type="date" 
                  value="2023-01-30"
                  className="mt-1 block w-full bg-gray-600 border-gray-600 rounded text-white text-sm px-2 py-1"
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
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Commission (%)</label>
                <input 
                  type="number" 
                  value="0.1"
                  step="0.01"
                  className="mt-1 block w-full bg-gray-600 border-gray-600 rounded text-white text-sm px-2 py-1"
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