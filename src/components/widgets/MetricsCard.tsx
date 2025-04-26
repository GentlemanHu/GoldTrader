import React from 'react';
import { TrendingUp, TrendingDown, Award, Target, BarChart2 } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: 'chart' | 'target' | 'award';
  description?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  icon = 'chart',
  description
}) => {
  const getIcon = () => {
    switch(icon) {
      case 'chart':
        return <BarChart2 className="h-6 w-6 text-amber-500" />;
      case 'target':
        return <Target className="h-6 w-6 text-amber-500" />;
      case 'award':
        return <Award className="h-6 w-6 text-amber-500" />;
      default:
        return <BarChart2 className="h-6 w-6 text-amber-500" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-xl font-bold text-white">{value}</h3>
        </div>
        <div className="p-2 bg-gray-700 rounded-md">
          {getIcon()}
        </div>
      </div>
      
      {(change || description) && (
        <div className="mt-2">
          {change && (
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span>{change}</span>
            </div>
          )}
          
          {description && (
            <p className="text-gray-400 text-xs mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricsCard;