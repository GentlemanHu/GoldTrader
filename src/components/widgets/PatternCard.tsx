import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { PatternDetection } from '../../types';

interface PatternCardProps {
  pattern: PatternDetection;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  const getDirectionIcon = () => {
    switch(pattern.direction) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getConfidenceColor = () => {
    if (pattern.confidence > 0.8) return 'bg-green-500';
    if (pattern.confidence > 0.65) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow transition-transform hover:transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="p-2 bg-gray-700 rounded-md mr-3">
            {getDirectionIcon()}
          </div>
          <div>
            <h4 className="text-white font-medium">{pattern.pattern}</h4>
            <p className="text-gray-400 text-xs">{pattern.timeframe} ({pattern.detectedAt})</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${getConfidenceColor()} mr-1`}></div>
          <span className="text-white text-sm">{(pattern.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-3">{pattern.description}</p>
      
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Historical Accuracy: {(pattern.historicalAccuracy * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default PatternCard;