import React from 'react';
import { PipelineStatus as PipelineStatusType } from '../../types';
import { Check, Loader2, AlertCircle, Clock } from 'lucide-react';

interface PipelineStatusProps {
  status: PipelineStatusType;
}

const PipelineStatus: React.FC<PipelineStatusProps> = ({ status }) => {
  const getStatusIcon = (agentStatus: string) => {
    switch(agentStatus) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (agentStatus: string) => {
    switch(agentStatus) {
      case 'completed':
        return 'Completed';
      case 'running':
        return 'Running';
      case 'error':
        return 'Error';
      default:
        return 'Idle';
    }
  };

  const getStatusColor = (agentStatus: string) => {
    switch(agentStatus) {
      case 'completed':
        return 'bg-green-500';
      case 'running':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Pipeline Status</h3>
        {status.lastRun && (
          <div className="text-xs text-gray-400">
            Last run: {new Date(status.lastRun).toLocaleString()}
          </div>
        )}
      </div>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
        
        <div className="space-y-6">
          <div className="flex items-start relative">
            <div className={`z-10 rounded-full p-1 ${getStatusColor(status.newsAgent)}`}>
              {getStatusIcon(status.newsAgent)}
            </div>
            <div className="ml-4">
              <h4 className="text-white font-medium">News Sentiment Analysis</h4>
              <div className="text-xs text-gray-400">
                {getStatusText(status.newsAgent)}
              </div>
            </div>
          </div>
          
          <div className="flex items-start relative">
            <div className={`z-10 rounded-full p-1 ${getStatusColor(status.patternAgent)}`}>
              {getStatusIcon(status.patternAgent)}
            </div>
            <div className="ml-4">
              <h4 className="text-white font-medium">Pattern Detection</h4>
              <div className="text-xs text-gray-400">
                {getStatusText(status.patternAgent)}
              </div>
            </div>
          </div>
          
          <div className="flex items-start relative">
            <div className={`z-10 rounded-full p-1 ${getStatusColor(status.strategyAgent)}`}>
              {getStatusIcon(status.strategyAgent)}
            </div>
            <div className="ml-4">
              <h4 className="text-white font-medium">Strategy Generation</h4>
              <div className="text-xs text-gray-400">
                {getStatusText(status.strategyAgent)}
                {status.strategyAgent === 'running' && status.currentStage && (
                  <div className="mt-1">{status.currentStage}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-start relative">
            <div className={`z-10 rounded-full p-1 ${getStatusColor(status.evaluationAgent)}`}>
              {getStatusIcon(status.evaluationAgent)}
            </div>
            <div className="ml-4">
              <h4 className="text-white font-medium">Backtest Evaluation</h4>
              <div className="text-xs text-gray-400">
                {getStatusText(status.evaluationAgent)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {status.progress > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{status.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full" 
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button className="py-2 px-4 bg-amber-500 text-gray-900 rounded font-medium text-sm hover:bg-amber-600 transition-colors">
          Run Pipeline
        </button>
      </div>
    </div>
  );
};

export default PipelineStatus;