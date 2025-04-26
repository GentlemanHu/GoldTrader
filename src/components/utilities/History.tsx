import React, { useState } from 'react';
import { Calendar, Filter, Download, Clock, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface HistoryEvent {
  id: string;
  type: 'strategy' | 'backtest' | 'trade' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  details?: Record<string, any>;
}

const History: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  
  const mockHistory: HistoryEvent[] = [
    {
      id: '1',
      type: 'strategy',
      title: 'New Strategy Generated',
      description: 'Pattern-Based Breakout strategy created based on recent market analysis',
      timestamp: '2024-03-10 14:30:00',
      status: 'success',
      details: {
        winRate: '63%',
        profitFactor: 2.5
      }
    },
    {
      id: '2',
      type: 'backtest',
      title: 'Backtest Completed',
      description: 'News Sentiment Reversal strategy backtest for January 2024',
      timestamp: '2024-03-10 12:15:00',
      status: 'success',
      details: {
        profit: '$1,245',
        trades: 45
      }
    },
    {
      id: '3',
      type: 'system',
      title: 'System Update',
      description: 'Trading parameters updated based on market volatility',
      timestamp: '2024-03-09 16:45:00',
      status: 'success'
    },
    {
      id: '4',
      type: 'trade',
      title: 'Trade Executed',
      description: 'Long position opened based on breakout pattern',
      timestamp: '2024-03-09 10:30:00',
      status: 'failed',
      details: {
        entry: 1962.50,
        exit: 1958.30,
        profit: -420
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-amber-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">System History</h1>
          <p className="text-gray-400">
            Track all system activities and events
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center py-2 px-3 bg-gray-800 text-white rounded hover:bg-gray-700">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{timeRange}</span>
          </button>
          <button className="flex items-center py-2 px-3 bg-amber-500 text-gray-900 rounded hover:bg-amber-600">
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Total Events</div>
          <div className="text-2xl font-bold text-white mt-1">156</div>
          <div className="text-xs text-gray-400 mt-1">Last 7 days</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Success Rate</div>
          <div className="text-2xl font-bold text-green-500 mt-1">94.2%</div>
          <div className="text-xs text-gray-400 mt-1">+2.3% vs last week</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Average Response</div>
          <div className="text-2xl font-bold text-white mt-1">1.2s</div>
          <div className="text-xs text-green-500 mt-1">-0.3s improvement</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">System Health</div>
          <div className="text-2xl font-bold text-green-500 mt-1">Optimal</div>
          <div className="text-xs text-gray-400 mt-1">All systems operational</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Recent Events</h2>
          <div className="flex space-x-2">
            <button className="text-sm text-gray-400 hover:text-white">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {mockHistory.map((event) => (
            <div key={event.id} className="p-4 hover:bg-gray-750">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getStatusIcon(event.status)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">{event.title}</h3>
                    <span className="text-xs text-gray-400">{event.timestamp}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                  {event.details && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {Object.entries(event.details).map(([key, value]) => (
                        <div key={key} className="bg-gray-700 px-2 py-1 rounded text-xs">
                          <span className="text-gray-400">{key}: </span>
                          <span className="text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Event Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Strategy Events</div>
              <div className="text-white font-medium">45</div>
              <div className="text-xs text-green-500 mt-1">+12% vs avg</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Backtest Events</div>
              <div className="text-white font-medium">32</div>
              <div className="text-xs text-amber-500 mt-1">-5% vs avg</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Trade Events</div>
              <div className="text-white font-medium">64</div>
              <div className="text-xs text-green-500 mt-1">+8% vs avg</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">System Events</div>
              <div className="text-white font-medium">15</div>
              <div className="text-xs text-gray-400 mt-1">Normal</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-300">Peak Activity Time</span>
              </div>
              <span className="text-sm font-medium text-white">14:30 UTC</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-300">Success Rate Trend</span>
              </div>
              <span className="text-sm font-medium text-green-500">Improving</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;