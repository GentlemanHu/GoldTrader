import React, { useState } from 'react';
import { Calendar, ArrowUpRight, ArrowDownRight, Clock, Plus, Upload, X } from 'lucide-react';
import { useTradeStore } from '../../store/useTradeStore';



const TradeJournal: React.FC = () => {
  // Track which trade is being edited
  const [editId, setEditId] = useState<string | null>(null);
  const [dateRange] = useState('This Month');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newEntry, setNewEntry] = useState({
    entryDate: new Date().toISOString().slice(0, 16), // 'YYYY-MM-DDTHH:mm'
    exitDate: new Date().toISOString().slice(0, 16),
    type: 'long',
    entry: '',
    exit: '',
    stopLoss: '',
    lotSize: '1.00',
    strategy: '',
    notes: ''
  });
  
  // Zustand trades store
  const trades = useTradeStore((state) => state.trades);
  const addTrade = useTradeStore((state) => state.addTrade);
  const removeTrade = useTradeStore((state) => state.removeTrade);


  // Compute stats from trades
  const stats = React.useMemo(() => {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        averagePips: 0,
        totalProfit: 0,
        bestTrade: 0,
        worstTrade: 0,
        averageHoldTime: '--',
      };
    }
    const wins = trades.filter(t => t.profit > 0).length;
    const losses = trades.filter(t => t.profit <= 0).length;
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const bestTrade = Math.max(...trades.map(t => t.profit));
    const worstTrade = Math.min(...trades.map(t => t.profit));
    const averagePips = trades.reduce((sum, t) => sum + t.pips, 0) / trades.length;
    // Calculate average hold time
    const totalMs = trades.reduce((sum, t) => sum + (t.holdMs || 0), 0);
    const avgMs = totalMs / trades.length;
    function formatDuration(ms: number) {
      if (!ms || ms < 60000) return '<1m';
      const d = Math.floor(ms / (24*60*60*1000));
      const h = Math.floor((ms % (24*60*60*1000)) / (60*60*1000));
      const m = Math.floor((ms % (60*60*1000)) / (60*1000));
      let str = '';
      if (d) str += `${d}D `;
      if (h) str += `${h}H `;
      if (m) str += `${m}M`;
      return str.trim();
    }
    // Average R:R
    const avgRR = trades.reduce((sum, t) => sum + (t.rr || 0), 0) / trades.length;
    return {
      totalTrades: trades.length,
      winRate: Math.round((wins / trades.length) * 100),
      profitFactor: losses === 0 ? wins : (wins / (losses || 1)),
      averagePips,
      totalProfit,
      bestTrade,
      worstTrade,
      averageHoldTime: formatDuration(avgMs),
      avgRR: avgRR || 0,
    };
  }, [trades]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate pips for XAUUSD
    const entryPrice = parseFloat(newEntry.entry);
    const exitPrice = parseFloat(newEntry.exit);
    let pips = 0;
    if (newEntry.type === 'long') {
      pips = (exitPrice - entryPrice) / 0.01;
    } else {
      pips = (entryPrice - exitPrice) / 0.01;
    }
    // Calculate hold time in ms
    const entryDt = new Date(newEntry.entryDate);
    const exitDt = new Date(newEntry.exitDate);
    const holdMs = Math.max(0, exitDt.getTime() - entryDt.getTime());
    const lotSize = parseFloat(newEntry.lotSize);
    const stopLoss = parseFloat(newEntry.stopLoss);
    // Risk and reward in pips
    let risk = 0, reward = 0;
    if (newEntry.type === 'long') {
      risk = (entryPrice - stopLoss) / 0.01;
      reward = (exitPrice - entryPrice) / 0.01;
    } else {
      risk = (stopLoss - entryPrice) / 0.01;
      reward = (entryPrice - exitPrice) / 0.01;
    }
    const rr = risk !== 0 ? Math.abs(reward / risk) : 0;
    // Correct pip value for XAUUSD: $100 per pip per standard lot (1 lot = 100 oz)
    const profit = parseFloat((pips * 100 * lotSize).toFixed(2));
    if (editId) {
      // Edit mode: update existing trade
      removeTrade(editId);
      addTrade({
        id: editId,
        entryDate: newEntry.entryDate,
        exitDate: newEntry.exitDate,
        pair: 'XAUUSD',
        type: newEntry.type as 'long' | 'short',
        entry: entryPrice,
        exit: exitPrice,
        stopLoss,
        lotSize,
        profit,
        pips: parseFloat(pips.toFixed(1)),
        rr: parseFloat(rr.toFixed(2)),
        strategy: newEntry.strategy,
        notes: newEntry.notes,
        holdMs,
      });
      setEditId(null);
    } else {
      // Add mode: add new trade
      addTrade({
        id: Date.now().toString(),
        entryDate: newEntry.entryDate,
        exitDate: newEntry.exitDate,
        pair: 'XAUUSD',
        type: newEntry.type as 'long' | 'short',
        entry: entryPrice,
        exit: exitPrice,
        stopLoss,
        lotSize,
        profit,
        pips: parseFloat(pips.toFixed(1)),
        rr: parseFloat(rr.toFixed(2)),
        strategy: newEntry.strategy,
        notes: newEntry.notes,
        holdMs,
      });
    }
    setShowModal(false);
    setSelectedImage(null);
    setNewEntry({
      entryDate: new Date().toISOString().slice(0, 16),
      exitDate: new Date().toISOString().slice(0, 16),
      type: 'long',
      entry: '',
      exit: '',
      stopLoss: '',
      lotSize: '1.00',
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
              title="Close modal"
              aria-label="Close modal"
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Entry Date/Time</label>
                    <input
                      type="datetime-local"
                      value={newEntry.entryDate}
                      onChange={(e) => setNewEntry({...newEntry, entryDate: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                      title="Entry DateTime"
                      aria-label="Entry DateTime"
                      placeholder="Entry date/time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Exit Date/Time</label>
                    <input
                      type="datetime-local"
                      value={newEntry.exitDate}
                      onChange={(e) => setNewEntry({...newEntry, exitDate: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                      title="Exit DateTime"
                      aria-label="Exit DateTime"
                      placeholder="Exit date/time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Lot Size</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={newEntry.lotSize}
                      onChange={(e) => setNewEntry({...newEntry, lotSize: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                      title="Lot Size"
                      aria-label="Lot Size"
                      placeholder="1.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <select
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-2 text-sm"
                      title="Trade type"
                      aria-label="Trade type"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Stop-Loss ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newEntry.stopLoss}
                      onChange={(e) => setNewEntry({...newEntry, stopLoss: e.target.value})}
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
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">DATE</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">PAIR</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">TYPE</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">ENTRY</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">EXIT</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">STOP</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">LOT</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">PROFIT</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">PIPS</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">R:R</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase">STRATEGY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center text-gray-400 py-8">No trades yet. Add your first trade!</td>
                </tr>
              ) : (
                 trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-sm text-gray-300">{trade.entryDate?.replace('T', ' ')}</td>
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
                    <td className="px-4 py-3 text-sm text-gray-300">${trade.entry.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">${trade.exit.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">${trade.stopLoss.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{trade.lotSize.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}> 
                      ${trade.profit.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{trade.pips.toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{trade.rr.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{trade.strategy}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 flex gap-2">
                      <button className="text-yellow-400 hover:underline" onClick={() => {
                        setShowModal(true);
                        setEditId(trade.id);
                        setNewEntry({
                          entryDate: trade.entryDate.slice(0, 16),
                          exitDate: trade.exitDate.slice(0, 16),
                          type: trade.type,
                          entry: trade.entry.toString(),
                          exit: trade.exit.toString(),
                          stopLoss: trade.stopLoss.toString(),
                          lotSize: trade.lotSize.toString(),
                          strategy: trade.strategy,
                          notes: trade.notes
                        });
                      }}>Edit</button>
                      <button className="text-red-400 hover:underline" onClick={() => removeTrade(trade.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
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
              <div className="text-green-500 font-medium">{stats.bestTrade !== 0 ? `$${stats.bestTrade}` : '--'}</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Worst Trade</div>
              <div className="text-red-500 font-medium">{stats.worstTrade !== 0 ? `$${stats.worstTrade}` : '--'}</div>
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
              <span className="text-sm font-medium text-white">{stats.averageHoldTime}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Average Pips</span>
              <span className="text-2xl font-semibold text-white">{Number(stats.averagePips).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeJournal;