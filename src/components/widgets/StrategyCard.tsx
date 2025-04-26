import React from 'react';
import { Strategy } from '../../types';
import { Zap, AlertTriangle, ArrowRight } from 'lucide-react';

interface StrategyCardProps {
  strategy: Strategy;
  onSelect?: (id: string) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onSelect }) => {
  const getRiskRewardColor = () => {
    if (strategy.riskReward >= 2) return 'text-green-500';
    if (strategy.riskReward >= 1) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getWinRateColor = () => {
    if (strategy.expectedWinRate >= 0.65) return 'text-green-500';
    if (strategy.expectedWinRate >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow transition-all hover:bg-gray-750">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="p-2 bg-gray-700 rounded-md mr-3">
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-white font-medium">{strategy.name}</h4>
            <p className="text-gray-400 text-xs">{strategy.timeframe} timeframe</p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-3">{strategy.description}</p>
      
      <div className="mb-3">
        <div className="text-xs font-medium text-gray-300 mb-1">Entry Conditions:</div>
        <ul className="text-xs text-gray-400 ml-4 list-disc space-y-1">
          {strategy.entryConditions.map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-xs text-gray-400">Stop Loss</div>
          <div className="text-white font-medium">{strategy.stopLoss}%</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-xs text-gray-400">Take Profit</div>
          <div className="text-white font-medium">{strategy.takeProfit}%</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs mb-4">
        <div>
          <span className="text-gray-400">Risk/Reward: </span>
          <span className={getRiskRewardColor()}>{strategy.riskReward.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-gray-400">Win Rate: </span>
          <span className={getWinRateColor()}>{(strategy.expectedWinRate * 100).toFixed(0)}%</span>
        </div>
      </div>
      
      <button 
        onClick={() => onSelect && onSelect(strategy.id)}
        className="w-full py-2 rounded bg-amber-500 text-gray-900 font-medium text-sm flex items-center justify-center hover:bg-amber-600 transition-colors"
      >
        <span>Run Backtest</span>
        <ArrowRight className="ml-1 h-4 w-4" />
      </button>
    </div>
  );
};

export default StrategyCard;