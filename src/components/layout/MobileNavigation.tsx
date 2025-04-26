import React from 'react';
import { 
  BarChart3, 
  LineChart, 
  Newspaper, 
  Zap, 
  Workflow
} from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'news', name: 'News', icon: <Newspaper size={20} /> },
    { id: 'patterns', name: 'Patterns', icon: <Zap size={20} /> },
    { id: 'strategy', name: 'Strategy', icon: <Zap size={20} /> },
    { id: 'backtest', name: 'Backtest', icon: <LineChart size={20} /> },
    { id: 'pipeline', name: 'Pipeline', icon: <Workflow size={20} /> },
  ];

  return (
    <div className="md:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-10">
        <div className="flex justify-around">
          {navigationItems.slice(0, 5).map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 flex flex-col items-center ${
                activeTab === item.id 
                  ? 'text-amber-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;