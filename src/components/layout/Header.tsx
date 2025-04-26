import React, { useState } from 'react';
import { Search, Settings, Bell, ChevronDown, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-theme');
  };

  return (
    <header className={`bg-gray-900 border-b border-gray-800 h-16 flex items-center justify-between px-4 lg:px-6 ${className}`}>
      <div className="flex items-center">
        <div className="flex items-center mr-10">
          <div className="bg-amber-500 w-8 h-8 rounded-md mr-2 flex items-center justify-center">
            <span className="text-gray-900 font-bold text-lg">G</span>
          </div>
          <h1 className="text-white font-semibold text-xl">
            GoldTrader<span className="text-amber-500 ml-1">AI</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <button className="px-3 py-2 text-white hover:bg-gray-800 rounded-md text-sm">Dashboard</button>
          <button className="px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-md text-sm">Backtests</button>
          <button className="px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-md text-sm">Strategies</button>
          <button className="px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-md text-sm">Settings</button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..."
            className="bg-gray-800 text-gray-100 pl-10 pr-4 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
        </div>
        
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
          <Bell size={20} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
          >
            <Settings size={20} />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <button onClick={toggleTheme} className="p-1 rounded-md hover:bg-gray-700">
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
              </div>
              <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left">
                Notification Settings
              </button>
              <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left">
                Trading Preferences
              </button>
              <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left">
                API Configuration
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          <ChevronDown className="text-gray-400 h-4 w-4 ml-1" />
        </div>
      </div>
    </header>
  );
};

export default Header;