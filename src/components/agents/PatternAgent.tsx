import React from 'react';
import PatternBarChart from '../charts/PatternBarChart';
import PatternCard from '../widgets/PatternCard';
import { useForexData } from '../../hooks/useForexData';
import { detectPatterns } from '../../utils/patternDetection';
import { PatternDetection } from '../../types';
import { TrendingUp, TrendingDown, Filter, RefreshCw, AlertTriangle } from 'lucide-react';

const TIMEFRAMES = ['1H', '4H', '1D', '1W'];
const PATTERN_TYPES = [
  'Double Bottom/Top',
  'Head & Shoulders',
  'Triangles',
  'Flags/Pennants',
  'Moving Avg Crosses',
];

const PatternAgent: React.FC = () => {
  // Config state (pending edits)
  const [pendingTimeframes, setPendingTimeframes] = React.useState<string[]>(['4H', '1D']);
  const [pendingMinConfidence, setPendingMinConfidence] = React.useState<number>(65);
  const [pendingPatternTypes, setPendingPatternTypes] = React.useState<string[]>([...PATTERN_TYPES]);

  // Applied config (used for filtering)
  const [appliedTimeframes, setAppliedTimeframes] = React.useState<string[]>(['4H', '1D']);
  const [appliedMinConfidence, setAppliedMinConfidence] = React.useState<number>(65);
  const [appliedPatternTypes, setAppliedPatternTypes] = React.useState<string[]>([...PATTERN_TYPES]);

  // Real-time candle and pattern data
  // Chart timeframe is first from appliedTimeframes (default to '1D')
  const chartTimeframe = (appliedTimeframes && appliedTimeframes.length > 0) ? appliedTimeframes[0] : '1D';
  // Map UI timeframes to API intervals
  const timeframeMap: Record<string, {interval: string, outputsize: number}> = {
    '1H': { interval: '1h', outputsize: 60 },
    '4H': { interval: '4h', outputsize: 60 },
    '1D': { interval: '1day', outputsize: 60 },
    '1W': { interval: '1week', outputsize: 60 },
  };
  const { historicalData, loading, error } = useForexData(60000, timeframeMap[chartTimeframe].interval, timeframeMap[chartTimeframe].outputsize);
  const [patternDetections, setPatternDetections] = React.useState<PatternDetection[]>([]);

  // Only show patterns matching applied config
  function normalize(s: string) {
    return s.replace(/\s+/g, '').toLowerCase();
  }
  const normalizedApplied = appliedPatternTypes.map(normalize);
  const filteredPatterns = patternDetections.filter(p =>
    normalizedApplied.includes(normalize(p.pattern)) &&
    p.confidence * 100 >= appliedMinConfidence
  );

  React.useEffect(() => {
    if (historicalData && Array.isArray(historicalData)) {
      const candles = historicalData.map((c: any) => ({
        date: c.datetime || c.date,
        open: parseFloat(c.open),
        high: parseFloat(c.high),
        low: parseFloat(c.low),
        close: parseFloat(c.close),
        volume: c.volume ? parseFloat(c.volume) : undefined
      }));
      setPatternDetections(detectPatterns(candles, chartTimeframe));
    }
  }, [historicalData, chartTimeframe]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Technical Pattern Detection</h1>
          <p className="text-gray-400">
            Identifying chart patterns and technical signals for XAUUSD
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center py-2 px-3 bg-gray-800 text-white rounded hover:bg-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </button>
          <button className="flex items-center py-2 px-3 bg-amber-500 text-gray-900 rounded hover:bg-amber-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-80"><span className="text-gray-400 animate-pulse">Loading chart...</span></div>
          ) : error ? (
            <div className="flex justify-center items-center h-80"><span className="text-red-500">Failed to load chart data.</span></div>
          ) : (
            <PatternBarChart data={historicalData || []} />
          )}
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg h-full">
          <h3 className="text-lg font-semibold mb-3 text-white">Pattern Summary</h3>
          <div className="space-y-4 text-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Bullish Patterns</div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-xl font-bold">
                    {patternDetections.filter(p => p.direction === 'bullish').length}
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Bearish Patterns</div>
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-xl font-bold">
                    {patternDetections.filter(p => p.direction === 'bearish').length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-2">Current Market Bias</h4>
              <div className="flex items-center bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                {(() => {
                  if (!patternDetections.length) return <span className="text-gray-400">No data</span>;
                  const bullish = patternDetections.filter(p => p.direction === 'bullish');
                  const confidence = bullish.length ? Math.round(bullish.reduce((sum, p) => sum + p.confidence, 0) / bullish.length * 100) : 0;
                  return <span className="text-green-500 font-medium">Bullish ({confidence}% confidence)</span>;
                })()}
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-2">Strongest Pattern</h4>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  {(() => {
                    if (!patternDetections.length) return <div className="font-medium text-gray-400">No pattern</div>;
                    const strongest = patternDetections.reduce((prev, curr) => curr.confidence > prev.confidence ? curr : prev, patternDetections[0]);
                    return <>
                      <div className="font-medium">{strongest.pattern}</div>
                      <div className="text-xs text-gray-400">{strongest.timeframe} timeframe</div>
                    </>;
                  })()}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Confidence: <span className="text-green-500 font-medium">{patternDetections.length ? Math.round(patternDetections.reduce((max, p) => p.confidence > max ? p.confidence : max, 0) * 100) : '--'}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {patternDetections.some(p => p.direction === 'bullish') && patternDetections.some(p => p.direction === 'bearish') && (
        <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-amber-500 font-medium">Pattern Conflict Detected</h3>
            <p className="text-gray-300 text-sm">
              There is a conflict between bullish and bearish patterns detected in the current timeframe. Consider prioritizing higher timeframe signals over lower timeframe patterns.
            </p>
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Detected Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatterns.length > 0 ? (
            filteredPatterns.map(pattern => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))
          ) : (
            <div className="text-gray-400 text-center">No patterns detected.</div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-white">Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Timeframes</h4>
            <div className="flex flex-wrap gap-2">
              {TIMEFRAMES.map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setPendingTimeframes(pending => pending.includes(tf) ? pending.filter(t => t !== tf) : [...pending, tf])}
                  className={
                    pendingTimeframes.includes(tf)
                      ? 'bg-amber-500 text-gray-900 text-xs rounded px-2 py-1'
                      : 'bg-gray-600 text-xs rounded px-2 py-1'
                  }
                  disabled={loading}
                  aria-pressed={pendingTimeframes.includes(tf) ? "true" : "false"}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Minimum Confidence</h4>
            <div className="flex items-center">
              <input 
                type="range" 
                min="50" 
                max="95" 
                value={pendingMinConfidence}
                onChange={e => setPendingMinConfidence(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                aria-label="Minimum Confidence"
                title="Minimum Confidence"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-white">{pendingMinConfidence}%</span>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Patterns to Detect</h4>
            <div className="mt-1 text-xs">
              <div className="grid grid-cols-2 gap-2">
                {PATTERN_TYPES.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-1"
                      checked={pendingPatternTypes.includes(type)}
                      onChange={() => setPendingPatternTypes(pending =>
                        pending.includes(type)
                          ? pending.filter(t => t !== type)
                          : [...pending, type]
                      )}
                      disabled={loading}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            className="py-2 px-4 bg-amber-500 text-gray-900 rounded font-medium text-sm hover:bg-amber-600 transition-colors"
            onClick={() => {
              setAppliedTimeframes([...pendingTimeframes]);
              setAppliedMinConfidence(pendingMinConfidence);
              setAppliedPatternTypes([...pendingPatternTypes]);
            }}
            disabled={loading}
          >
            Update Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternAgent;