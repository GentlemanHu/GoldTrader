import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Trade {
  id: string;
  entryDate: string; // ISO string, includes date and time
  exitDate: string;  // ISO string, includes date and time
  holdMs: number;    // Hold time in milliseconds
  pair: string;
  type: 'long' | 'short';
  entry: number;
  exit: number;
  stopLoss: number;
  lotSize: number;   // Lot size for this trade
  profit: number;
  pips: number;
  rr: number;        // Risk/Reward ratio for this trade
  strategy: string;
  notes: string;
}

interface TradeStore {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  removeTrade: (id: string) => void;
  setTrades: (trades: Trade[]) => void;
  clearTrades: () => void;
}

export const useTradeStore = create<TradeStore>()(
  persist(
    (set, get) => ({
      trades: [],
      addTrade: (trade) => set({ trades: [trade, ...get().trades] }),
      removeTrade: (id) => set({ trades: get().trades.filter(t => t.id !== id) }),
      setTrades: (trades) => set({ trades }),
      clearTrades: () => set({ trades: [] }),
    }),
    {
      name: 'goldtrader-trades', // key in localStorage
    }
  )
);
