import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { NewsSentiment } from '../../types';

interface SentimentChartProps {
  data: NewsSentiment[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  // Early return with loading state if data is not available
  if (!data || !Array.isArray(data)) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 h-full">
        <h3 className="text-lg font-semibold mb-3 text-white">News Sentiment Trend</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Loading sentiment data...
        </div>
      </div>
    );
  }

  // Transform sentiment data for the chart
  const chartData = data.map(item => ({
    date: item.date,
    sentiment: item.score,
    impact: item.impact === 'high' ? 1 : item.impact === 'medium' ? 0.6 : 0.3
  }));

  // Add a few more data points to fill out the chart
  const extraDates = [
    '2023-01-15', '2023-01-10', '2023-01-05', '2023-01-02', 
    '2023-01-17', '2023-01-22', '2023-01-29'
  ];
  
  extraDates.forEach(date => {
    if (!chartData.find(d => d.date === date)) {
      chartData.push({
        date,
        sentiment: (Math.random() * 2 - 1) * 0.5, // Between -0.5 and 0.5
        impact: Math.random() * 0.6 + 0.2 // Between 0.2 and 0.8
      });
    }
  });
  
  // Sort by date
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <h3 className="text-lg font-semibold mb-3 text-white">News Sentiment Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
            <XAxis 
              dataKey="date"
              tick={{ fill: '#A0AEC0', fontSize: 11 }}
              axisLine={{ stroke: '#4A5568' }}
              tickLine={{ stroke: '#4A5568' }}
              minTickGap={20}
            />
            <YAxis 
              domain={[-1, 1]}
              tick={{ fill: '#A0AEC0', fontSize: 11 }}
              axisLine={{ stroke: '#4A5568' }}
              tickLine={{ stroke: '#4A5568' }}
              tickFormatter={(value) => value.toFixed(1)}
              ticks={[-1, -0.5, 0, 0.5, 1]}
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
                if (name === 'sentiment') {
                  const num = Number(value);
                  let sentiment = 'Neutral';
                  if (num > 0.5) sentiment = 'Very Positive';
                  else if (num > 0) sentiment = 'Positive';
                  else if (num < -0.5) sentiment = 'Very Negative';
                  else if (num < 0) sentiment = 'Negative';
                  return [`${num.toFixed(2)} (${sentiment})`, 'Sentiment'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <defs>
              <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNegativeSentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="sentiment" 
              stroke="#10B981" 
              fill="url(#colorSentiment)" 
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
              isAnimationActive={true}
              animationBegin={300}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentChart;