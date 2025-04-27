import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface PatternBarChartProps {
  data: any[];
}

const PatternBarChart: React.FC<PatternBarChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-white">XAUUSD Price Bar Chart</h2>
        <div className="text-xs text-gray-400">Gold Spot / US Dollar</div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
            <XAxis dataKey="date" axisLine={{ stroke: '#4A5568' }} tick={{ fill: '#A0AEC0', fontSize: 12 }} tickLine={{ stroke: '#4A5568' }} minTickGap={30} />
            <YAxis domain={["dataMin - 5", "dataMax + 5"]} orientation="right" axisLine={{ stroke: '#4A5568' }} tick={{ fill: '#A0AEC0', fontSize: 12 }} tickLine={{ stroke: '#4A5568' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A202C', borderColor: '#2D3748', color: '#E2E8F0', fontSize: 12, borderRadius: 4 }}
              formatter={(value, name) => {
                let displayName = typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : String(name);
                return [`$${Number(value).toFixed(2)}`, displayName];
              }}
              labelFormatter={label => `Date: ${label}`}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
            <Bar dataKey="close" fill="#F6AD55" name="Close Price" barSize={22} />
            <Bar dataKey="open" fill="#38B2AC" name="Open Price" barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PatternBarChart;
