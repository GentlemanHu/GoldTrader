import React from 'react';
import NewsCard from '../widgets/NewsCard';
import SentimentChart from '../charts/SentimentChart';
import SummaryCard from '../widgets/SummaryCard';
import { useNewsSentiment } from '../../hooks/useNewsSentiment';
import { AlertCircle, RefreshCw, Filter, Download } from 'lucide-react';

const NewsAgent: React.FC = () => {
  const [lookback, setLookback] = React.useState(10); // Number of articles
  const [threshold, setThreshold] = React.useState(0.0); // Sentiment score threshold
  const { news } = useNewsSentiment(lookback, threshold);

  // Filter news by threshold
  const filteredNews = news.filter(n => Math.abs(n.score) >= threshold);

  // Compute sentiment summary
  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
  let avgScore = 0;
  if (filteredNews && filteredNews.length > 0) {
    filteredNews.forEach(n => {
      sentimentCounts[n.sentiment]++;
      avgScore += n.score;
    });
    avgScore /= filteredNews.length;
  }

  let overallBias = 'Neutral';
  let biasColor = 'text-gray-400';
  if (avgScore > 0.15) { overallBias = 'Bullish'; biasColor = 'text-green-500'; }
  else if (avgScore < -0.15) { overallBias = 'Bearish'; biasColor = 'text-red-500'; }

  let impactConfidence = 'Low';
  let impactColor = 'text-blue-400';
  let impactPct = Math.abs(avgScore) * 100;
  if (impactPct > 70) { impactConfidence = 'High'; impactColor = 'text-green-400'; }
  else if (impactPct > 40) { impactConfidence = 'Medium'; impactColor = 'text-amber-500'; }

  // Key insight: pick the highest impact article
  const keyInsight = filteredNews && filteredNews.length > 0 ? filteredNews.reduce((a, b) => Math.abs(a.score) > Math.abs(b.score) ? a : b) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">News Sentiment Analysis</h1>
          <p className="text-gray-400">
            Analysis of financial news impacting XAUUSD price movements
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
          <SentimentChart data={filteredNews} />
        </div>
        
        <SummaryCard title="Sentiment Summary">
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">
                <span className="font-medium">Positive:</span> {sentimentCounts.positive} articles
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">
                <span className="font-medium">Negative:</span> {sentimentCounts.negative} articles
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
              <span className="text-sm">
                <span className="font-medium">Neutral:</span> {sentimentCounts.neutral} articles
              </span>
            </div>
            <div className="h-px bg-gray-700 my-4"></div>
            <p className="text-sm">
              <span className="font-medium">Overall Bias:</span>{' '}
              <span className={biasColor}>{overallBias}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Avg. Sentiment Score:</span>{' '}
              <span className="text-blue-400">{avgScore.toFixed(2)}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Impact Confidence:</span>{' '}
              <span className={impactColor}>{impactConfidence} ({impactPct.toFixed(0)}%)</span>
            </p>
          </div>
        </SummaryCard>
      </div>
      
      <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
        <div>
          <h3 className="text-amber-500 font-medium">Key Insight</h3>
          <p className="text-gray-300 text-sm">
            {keyInsight
              ? <>
                  <span className="font-semibold">{keyInsight.title}</span> — {keyInsight.summary}<br/>
                  <span className="text-blue-400">Sentiment Score: {keyInsight.score.toFixed(2)} ({keyInsight.sentiment})</span>
                </>
              : 'No high-impact news detected in the latest articles.'}
          </p>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent News Articles</h2>
          <button className="flex items-center text-xs text-gray-400 hover:text-white">
            <Download className="h-3 w-3 mr-1" />
            Export Articles
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-white">Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">News Sources</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-600 text-xs rounded px-2 py-1">Bloomberg</span>
              <span className="bg-gray-600 text-xs rounded px-2 py-1">Reuters</span>
              <span className="bg-gray-600 text-xs rounded px-2 py-1">WSJ</span>
              <span className="bg-gray-600 text-xs rounded px-2 py-1">Financial Times</span>
              <span className="bg-gray-600 text-xs rounded px-2 py-1">CNN</span>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Lookback Period</h4>
            <div className="flex items-center">
              <label htmlFor="lookback-slider" className="sr-only">Lookback Period (days)</label>
              <input 
                id="lookback-slider"
                type="range"
                min="1"
                max="30"
                value={lookback}
                onChange={e => setLookback(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                title="Lookback Period (articles)"
              />
              <span className="ml-2 text-sm text-white">{lookback} articles</span>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Sentiment Threshold</h4>
            <div className="flex items-center">
              <label htmlFor="sentiment-threshold-slider" className="sr-only">Sentiment Threshold</label>
              <input 
                id="sentiment-threshold-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                title="Sentiment Threshold"
              />
              <span className="ml-2 text-sm text-white">{threshold.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="py-2 px-4 bg-amber-500 text-gray-900 rounded font-medium text-sm hover:bg-amber-600 transition-colors">
            Update Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewsAgent;