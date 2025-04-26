import React from 'react';
import PriceChart from '../charts/PriceChart';
import PatternCard from '../widgets/PatternCard';
import { mockCandleData, mockPatternDetections } from '../../utils/mockData';
import { TrendingUp, TrendingDown, Filter, RefreshCw, AlertTriangle } from 'lucide-react';

const PatternAgent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Technical Pattern Detection</h1>
          <p className="text-gray-400">
            Identifying chart patterns and technical signals for XAUUSD
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center py-2 px-3 bg-gray-800 text-white rounded hover:bg-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </button>
          <button className="flex items-center py-2 px-3 bg-amber-500 text-gray-900 rounded hover:bg-amber-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart data={mockCandleData} />
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg h-full">
          <h3 className="text-lg font-semibold mb-3 text-white">Pattern Summary</h3>
          <div className="space-y-4 text-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Bullish Patterns</div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-xl font-bold">
                    {mockPatternDetections.filter(p => p.direction === 'bullish').length}
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Bearish Patterns</div>
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-xl font-bold">
                    {mockPatternDetections.filter(p => p.direction === 'bearish').length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-2">Current Market Bias</h4>
              <div className="flex items-center bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-green-500 font-medium">Bullish (72% confidence)</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-2">Strongest Pattern</h4>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Golden Cross</div>
                  <div className="text-xs text-gray-400">1D timeframe</div>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Confidence: <span className="text-green-500 font-medium">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-4 flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
        <div>
          <h3 className="text-amber-500 font-medium">Pattern Conflict Detected</h3>
          <p className="text-gray-300 text-sm">
            There is a conflict between the bullish Golden Cross on the daily timeframe and the bearish Head and Shoulders pattern. 
            Consider prioritizing the higher timeframe signal (daily) over the lower timeframe patterns.
          </p>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Detected Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPatternDetections.map(pattern => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-white">Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Timeframes</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-600 text-xs rounded px-2 py-1">1H</span>
              <span className="bg-amber-500 text-gray-900 text-xs rounded px-2 py-1">4H</span>
              <span className="bg-amber-500 text-gray-900 text-xs rounded px-2 py-1">1D</span>
              <span className="bg-gray-600 text-xs rounded px-2 py-1">1W</span>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Minimum Confidence</h4>
            <div className="flex items-center">
              <input 
                type="range" 
                min="50" 
                max="95" 
                value="65" 
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 text-sm text-white">65%</span>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Patterns to Detect</h4>
            <div className="mt-1 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" checked />
                  <span>Double Bottom/Top</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" checked />
                  <span>Head & Shoulders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" checked />
                  <span>Triangles</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" checked />
                  <span>Flags/Pennants</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" checked />
                  <span>Moving Avg Crosses</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="py-2 px-4 bg-amber-500 text-gray-900 rounded font-medium text-sm hover:bg-amber-600 transition-colors">
            Update Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternAgent;