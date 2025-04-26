import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { useForexData } from '../../hooks/useForexData';

interface PriceChartProps {
  data?: any[];
}

interface PriceChartProps {
  timeframe: string;
  setTimeframe: (tf: string) => void;
}

const PriceChart: React.FC<PriceChartProps> = ({ timeframe, setTimeframe }) => {
  const indicator = 'MACD';

  // Map UI timeframes to Twelve Data intervals
  const timeframeMap: Record<string, {interval: string, outputsize: number}> = {
    '1H': { interval: '1h', outputsize: 60 },
    '4H': { interval: '4h', outputsize: 60 },
    '1D': { interval: '1day', outputsize: 60 },
    '1W': { interval: '1week', outputsize: 60 },
  };
  const { currentPrice, historicalData, loading } = useForexData(60000, timeframeMap[timeframe].interval, timeframeMap[timeframe].outputsize);
  
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (historicalData && Array.isArray(historicalData)) {
      // Twelve Data returns an array of objects with keys: datetime, open, high, low, close, volume
      const data = historicalData.map((item: any) => ({
        date: item.datetime,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: item.volume ? parseFloat(item.volume) : 0
      })).reverse(); // oldest to newest

      // Calculate moving averages
      const withMA = data.map((d, i, arr) => {
        // 20 MA
        const ma20 = i >= 19 ? (
          arr.slice(i - 19, i + 1).reduce((sum, v) => sum + v.close, 0) / 20
        ) : null;
        // 50 MA
        const ma50 = i >= 49 ? (
          arr.slice(i - 49, i + 1).reduce((sum, v) => sum + v.close, 0) / 50
        ) : null;
        return { ...d, ma20, ma50 };
      });
      setChartData(withMA);
    }
  }, [historicalData]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="h-[400px] flex items-center justify-center text-gray-400">
          Loading price data...
        </div>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">XAUUSD Price Chart</h2>
          <div className="text-xs text-gray-400">Gold Spot / US Dollar</div>
          {currentPrice && (
            <div className="text-lg font-bold text-amber-500 mt-1">
              ${parseFloat(currentPrice['5. Exchange Rate']).toFixed(2)}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {['1H', '4H', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-medium ${
                  timeframe === tf
                    ? 'bg-amber-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${
                  tf === '1H' ? 'rounded-l-md' : tf === '1W' ? 'rounded-r-md' : ''
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="relative inline-block">
            <div className="flex items-center bg-gray-700 rounded-md px-3 py-1 text-xs cursor-pointer">
              <span className="text-gray-300 mr-1">{indicator}</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>
          </div>
          
          <button className="bg-gray-700 rounded-md p-1 text-gray-300 hover:bg-gray-600" title="Refresh Chart">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className="h-[400px]">
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
              dataKey="date" 
              axisLine={{ stroke: '#4A5568' }} 
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              tickLine={{ stroke: '#4A5568' }}
              minTickGap={30}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              orientation="right" 
              axisLine={{ stroke: '#4A5568' }} 
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              tickLine={{ stroke: '#4A5568' }}
              tickFormatter={formatPrice}
            />
            <YAxis 
              yAxisId="volume"
              orientation="left"
              domain={[0, 'dataMax + 50000']}
              axisLine={false}
              tick={false}
              tickLine={false}
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
                if (name === 'close') return [`${formatPrice(Number(value))}`, 'Close'];
                if (name === 'open') return [`${formatPrice(Number(value))}`, 'Open'];
                if (name === 'high') return [`${formatPrice(Number(value))}`, 'High'];
                if (name === 'low') return [`${formatPrice(Number(value))}`, 'Low'];
                if (name === 'volume') return [`${value.toLocaleString()}`, 'Volume'];
                if (name === 'ma20') return [`${formatPrice(Number(value))}`, '20 MA'];
                if (name === 'ma50') return [`${formatPrice(Number(value))}`, '50 MA'];
                return [value, name];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />
            <Bar 
              dataKey="volume" 
              yAxisId="volume"
              fill="#4A5568" 
              opacity={0.5} 
              name="Volume"
              barSize={20}
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#F6AD55" 
              strokeWidth={2} 
              dot={false} 
              name="Price"
            />
            <Line 
              type="monotone" 
              dataKey="ma20" 
              stroke="#38B2AC" 
              strokeWidth={1} 
              dot={false} 
              name="20 MA"
            />
            <Line 
              type="monotone" 
              dataKey="ma50" 
              stroke="#805AD5" 
              strokeWidth={1} 
              dot={false} 
              name="50 MA"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;