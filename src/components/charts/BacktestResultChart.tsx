import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { BacktestResult } from '../../types';

interface BacktestResultChartProps {
  result: BacktestResult;
}

const BacktestResultChart: React.FC<BacktestResultChartProps> = ({ result }) => {
  // Transform the trade data for the chart
  const chartData = result.trades.map((trade, index) => {
    // Calculate cumulative balance after each trade
    const previousBalance = index === 0 
      ? result.initialBalance 
      : result.initialBalance + result.trades.slice(0, index).reduce((sum, t) => sum + t.profit, 0);
    
    const currentBalance = previousBalance + trade.profit;
    
    return {
      id: index + 1,
      date: trade.entryDate,
      profit: trade.profit,
      balance: currentBalance,
      drawdown: trade.profit < 0 ? trade.profit : 0,
      isProfit: trade.profit >= 0
    };
  });

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">Backtest Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
            <XAxis 
              dataKey="id" 
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              axisLine={{ stroke: '#4A5568' }}
              tickLine={{ stroke: '#4A5568' }}
              label={{ value: 'Trade #', position: 'insideBottomRight', offset: -5, fill: '#A0AEC0' }}
            />
            <YAxis 
              yAxisId="profit"
              orientation="left"
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              axisLine={{ stroke: '#4A5568' }}
              tickLine={{ stroke: '#4A5568' }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis 
              yAxisId="balance"
              orientation="right"
              domain={[result.initialBalance * 0.9, result.finalBalance * 1.05]}
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              axisLine={{ stroke: '#4A5568' }}
              tickLine={{ stroke: '#4A5568' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A202C',
                borderColor: '#2D3748',
                color: '#E2E8F0',
                fontSize: 12,
                borderRadius: 4,
              }}
              formatter={(value, name) => {
                if (name === 'profit') return [`$${Number(value).toFixed(2)}`, 'Profit/Loss'];
                if (name === 'balance') return [`$${Number(value).toFixed(2)}`, 'Balance'];
                if (name === 'drawdown') return [`$${Number(value).toFixed(2)}`, 'Drawdown'];
                return [value, name];
              }}
              labelFormatter={(label) => `Trade #${label}`}
            />
            <Legend />
            <Bar 
              yAxisId="profit"
              dataKey="profit" 
              name="Profit/Loss" 
              fill={(entry) => (entry.isProfit ? '#10B981' : '#EF4444')} 
              barSize={20}
            />
            <Line 
              yAxisId="balance"
              type="monotone" 
              dataKey="balance" 
              name="Balance" 
              stroke="#F6E05E" 
              strokeWidth={2} 
              dot={{ fill: '#F6E05E', r: 4 }}
            />
            <Area
              yAxisId="profit"
              dataKey="drawdown"
              name="Drawdown"
              fill="#EF4444"
              fillOpacity={0.3}
              stroke="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BacktestResultChart;