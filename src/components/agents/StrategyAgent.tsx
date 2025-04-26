import React from 'react';
import StrategyCard from '../widgets/StrategyCard';
import SummaryCard from '../widgets/SummaryCard';
import { mockStrategies, mockPatternDetections, mockNewsSentiments } from '../../utils/mockData';
import { Zap, RefreshCw, Filter, ArrowRightLeft, Settings } from 'lucide-react';

const StrategyAgent: React.FC = () => {
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
                  {mockPatternDetections.slice(0, 3).map(pattern => (
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
                  {mockNewsSentiments.slice(0, 3).map(news => (
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
              <span className="font-medium">{mockStrategies.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Risk/Reward:</span>
              <span className="font-medium">
                {(mockStrategies.reduce((sum, s) => sum + s.riskReward, 0) / mockStrategies.length).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Win Rate:</span>
              <span className="font-medium">
                {(mockStrategies.reduce((sum, s) => sum + s.expectedWinRate, 0) / mockStrategies.length * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Best Strategy:</span>
              <span className="font-medium text-amber-500">Pattern-Based Breakout</span>
            </div>
            
            <div className="h-px bg-gray-700 my-3"></div>
            
            <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-2">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-amber-500 mr-2" />
                <h4 className="text-sm font-medium text-amber-500">System Recommendation</h4>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Based on current market conditions, the Pattern-Based Breakout strategy has the highest probability of success.
              </p>
            </div>
          </div>
        </SummaryCard>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Generated Strategies</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockStrategies.map(strategy => (
            <StrategyCard key={strategy.id} strategy={strategy} />
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">Strategy Generation Settings</h3>
          <button className="p-2 text-gray-400 hover:text-white bg-gray-700 rounded-md">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Data Sources</h4>
            <div className="space-y-2 text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" checked />
                <span>Use Technical Patterns</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" checked />
                <span>Use News Sentiment</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Use Market Indicators</span>
              </label>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Risk Management</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Risk/Reward Min</span>
                  <span>1.5</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.1" 
                  value="1.5" 
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Max Risk Per Trade</span>
                  <span>2%</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="5" 
                  step="0.5" 
                  value="2" 
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Strategy Types</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-amber-500 text-gray-900 text-xs rounded px-2 py-1">Trend Following</span>
              <span className="bg-amber-500 text-gray-900 text-xs rounded px-2 py-1">Breakout</span>
              <span className="bg-amber-500 text-gray-900 text-xs rounded px-2 py-1">Reversal</span>
              <span className="bg-gray-600 text-xs rounded px-2 py-1">Mean Reversion</span>
              <span className="bg-gray-600 text-xs rounded px-2 py-1">Scalping</span>
            </div>
            <div className="mt-2 flex justify-end">
              <button className="text-xs text-amber-500 hover:text-amber-400">
                Select All
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="py-2 px-4 bg-amber-500 text-gray-900 rounded font-medium text-sm hover:bg-amber-600 transition-colors flex items-center">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Generate Strategies
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyAgent;