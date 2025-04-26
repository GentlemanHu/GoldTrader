import React from 'react';
import { NewsSentiment } from '../../utils/newsSentiment';

interface NewsCardProps {
  news: NewsSentiment;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const getSentimentColor = () => {
    switch(news.sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getImpactColor = () => {
    switch(news.impact) {
      case 'high':
        return 'text-red-500 border-red-500';
      case 'medium':
        return 'text-yellow-500 border-yellow-500';
      default:
        return 'text-blue-500 border-blue-500';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow transition-all hover:bg-gray-750">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-medium">{news.title}</h4>
        <div className={`h-2 w-2 rounded-full ${getSentimentColor()}`}></div>
      </div>
      
      <div className="flex items-center text-xs text-gray-400 mb-3">
        <span>{news.source}</span>
        <span className="mx-2">•</span>
        <span>{news.date}</span>
        <span className="ml-auto">
          <span className={`border px-2 py-0.5 rounded ${getImpactColor()}`}>
            {news.impact} impact
          </span>
        </span>
      </div>
      
      <p className="text-gray-300 text-sm mb-3">{news.summary}</p>
      
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">Sentiment Score: {news.score > 0 ? '+' : ''}{news.score.toFixed(2)}</span>
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-amber-400 hover:underline hover:text-amber-300 font-medium"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsCard;