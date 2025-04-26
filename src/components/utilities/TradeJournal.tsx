import React, { useState } from 'react';
import { Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, Clock, DollarSign, Plus, Upload, X } from 'lucide-react';

interface Trade {
  id: string;
  date: string;
  pair: string;
  type: 'long' | 'short';
  entry: number;
  exit: number;
  profit: number;
  pips: number;
  strategy: string;
  notes: string;
}

const TradeJournal: React.FC = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'long',
    entry: '',
    exit: '',
    strategy: '',
    notes: ''
  });
  
  const mockTrades: Trade[] = [
    {
      id: '1',
      date: '2024-03-10',
      pair: 'XAUUSD',
      type: 'long',
      entry: 1962.50,
      exit: 1975.30,
      profit: 1280,
      pips: 128,
      strategy: 'Pattern-Based Breakout',
      notes: 'Strong breakout above resistance with increased volume'
    },
    {
      id: '2',
      date: '2024-03-09',
      pair: 'XAUUSD',
      type: 'short',
      entry: 1980.40,
      exit: 1965.20,
      profit: 1520,
      pips: 152,
      strategy: 'News Sentiment Reversal',
      notes: 'Bearish reversal after FOMC minutes'
    }
  ];

  const stats = {
    totalTrades: 45,
    winRate: 68,
    profitFactor: 2.4,
    averagePips: 85,
    totalProfit: 12450,
    bestTrade: 2800,
    worstTrade: -950,
    averageHoldTime: '4h 25m'
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setSelectedImage(null);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      type: 'long',
      entry: '',
      exit: '',
      strategy: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Trade Journal</h1>
          <p className="text-gray-400">
            Track and analyze your trading performance
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center py-2 px-3 bg-gray-800 text-white rounded hover:bg-gray-700">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{dateRange}</span>
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center py-2 px-3 bg-amber-500 text-gray-900 rounded hover:bg-amber-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-5xl p-6 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-white">New XAUUSD Trade Entry</h2>
              <span className="ml-2 px-2 py-1 bg-amber-500 bg-opacity-20 text-amber-500 rounded text-sm">Gold/USD</span>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <select
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                    >
                      <option value="long">Long</option>
                      <option value="short">Short</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Strategy</label>
                    <input
                      type="text"
                      value={newEntry.strategy}
                      onChange={(e) => setNewEntry({...newEntry, strategy: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                      placeholder="Enter strategy name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Entry Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newEntry.entry}
                      onChange={(e) => setNewEntry({...newEntry, entry: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Exit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newEntry.exit}
                      onChange={(e) => setNewEntry({...newEntry, exit: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Trade Notes</label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm h-32"
                    placeholder="Add your trade analysis, reasons for entry/exit, and any lessons learned..."
                  />
                </div>
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Chart Screenshot</label>
                <div className="mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg h-[calc(100%-2rem)]">
                  <div className="space-y-2 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-amber-500 hover:text-amber-400">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    {selectedImage && (
                      <p className="text-sm text-gray-400">
                        Selected: {selectedImage.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-gray-900 rounded font-medium text-sm hover:bg-amber-600"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Total Trades</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.totalTrades}</div>
          <div className="text-xs text-gray-400 mt-1">This month</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Win Rate</div>
          <div className="text-2xl font-bold text-green-500 mt-1">{stats.winRate}%</div>
          <div className="text-xs text-gray-400 mt-1">+2.3% vs last month</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Total Profit</div>
          <div className="text-2xl font-bold text-white mt-1">${stats.totalProfit}</div>
          <div className="text-xs text-green-500 mt-1">+$567.20 (21.4%)</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Average Pips</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.averagePips}</div>
          <div className="text-xs text-green-500 mt-1">+12.5 pips</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Recent Trades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">Pair</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">Entry</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">Exit</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">Profit</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">Pips</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mockTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 text-sm text-gray-300">{trade.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{trade.pair}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                      trade.type === 'long'
                        ? 'bg-green-500 bg-opacity-20 text-green-400'
                        : 'bg-red-500 bg-opacity-20 text-red-400'
                    }`}>
                      {trade.type === 'long' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">${trade.entry}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">${trade.exit}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${trade.profit}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{trade.pips}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{trade.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Best Trade</div>
              <div className="text-green-500 font-medium">${stats.bestTrade}</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Worst Trade</div>
              <div className="text-red-500 font-medium">${stats.worstTrade}</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Avg Hold Time</div>
              <div className="text-white font-medium">{stats.averageHoldTime}</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Total Trades</div>
              <div className="text-white font-medium">{stats.totalTrades}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-300">Average Trade Duration</span>
              </div>
              <span className="text-sm font-medium text-white">4h 25m</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-300">Risk/Reward Ratio</span>
              </div>
              <span className="text-sm font-medium text-white">1:2.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeJournal;