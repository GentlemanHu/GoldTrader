import React, { useState } from 'react';
import { 
  BarChart3, 
  LineChart, 
  Newspaper, 
  Zap, 
  Workflow, 
  History, 
  Settings,
  HelpCircle,
  TrendingUp,
  Calendar,
  ArrowRightLeft,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean; // for mobile drawer
  onClose?: () => void; // for mobile drawer
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen = false, onClose }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'news', name: 'News Agent', icon: <Newspaper size={20} /> },
    { id: 'patterns', name: 'Pattern Agent', icon: <TrendingUp size={20} /> },
    { id: 'strategy', name: 'Strategy Agent', icon: <Zap size={20} /> },
    { id: 'backtest', name: 'Evaluation Agent', icon: <LineChart size={20} /> },
    { id: 'pipeline', name: 'Pipeline', icon: <Workflow size={20} /> },
    { id: 'history', name: 'History', icon: <History size={20} /> },
  ];

  const utilities = [
    { id: 'trades', name: 'Trade Journal', icon: <Calendar size={20} /> },
    { id: 'market', name: 'Market Data', icon: <ArrowRightLeft size={20} /> },
    { id: 'help', name: 'Help & Support', icon: <HelpCircle size={20} /> },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-theme');
  };

  // Desktop Sidebar
  const sidebarContent = (
    <div className="py-4 flex flex-col h-full">
      <div className="px-4 mb-6">
        <div className="bg-gray-800 rounded-md p-2 flex items-center">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mr-2">
            <span className="text-gray-900 font-bold">XA</span>
          </div>
          <div>
            <div className="text-white text-sm font-medium">XAUUSD Trader</div>
            <div className="text-amber-500 text-xs">Automated</div>
          </div>
        </div>
      </div>
      <div className="px-3 mb-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 px-3">Main</h3>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full rounded-md px-3 py-2 text-sm ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-gray-900 font-medium' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-3 mt-auto">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 px-3">Utilities</h3>
        <ul className="space-y-1 mb-6">
          {utilities.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full rounded-md px-3 py-2 text-sm ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-gray-900 font-medium' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
          <li>
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white`}
              >
                <span className="mr-3"><Settings size={20} /></span>
                Settings
              </button>
              {showSettings && (
                <div className="absolute left-0 bottom-full mb-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Dark Mode</span>
                      <button onClick={toggleTheme} className="p-1 rounded-md hover:bg-gray-700">
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                      </button>
                    </div>
                  </div>
                  <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left">
                    Trading Preferences
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left">
                    API Configuration
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="bg-gray-900 w-64 fixed top-16 bottom-0 left-0 border-r border-gray-800 hidden md:block overflow-y-auto custom-scrollbar">
        {sidebarContent}
      </aside>
      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={onClose}></div>
          <aside className="bg-gray-900 w-64 h-full fixed top-0 left-0 shadow-lg border-r border-gray-800 animate-slide-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={onClose}
              aria-label="Close sidebar"
              title="Close sidebar menu"
            >
              ×
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;