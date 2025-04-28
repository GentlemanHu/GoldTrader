import React, { useState } from 'react';
import { Search, Settings, Bell, ChevronDown, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ className = '', onMenuClick }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-theme');
  };

  return (
    <header className={`bg-gray-900 border-b border-gray-800 h-16 flex items-center justify-between px-4 lg:px-6 ${className}`}>
      <div className="flex items-center">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden mr-3 text-gray-400 hover:text-white focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          title="Open sidebar menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div className="flex items-center mr-10">
          <img src="/goldtrader-logo.svg" alt="GoldTrader Logo" className="w-8 h-8 mr-2 rounded-md bg-white p-0.5" />
          <h1 className="text-white font-semibold text-xl">
            GoldTrader<span className="text-amber-500 ml-1">AI</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <button className="px-3 py-2 text-white hover:bg-gray-800 rounded-md text-sm" title="Dashboard">Dashboard</button>
          <button className="px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-md text-sm" title="Backtests">Backtests</button>
          <button className="px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-md text-sm" title="Strategies">Strategies</button>
          <button className="px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-md text-sm" title="Settings" aria-label="Settings">Settings</button>
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
        
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md" title="Notifications" aria-label="Notifications">
          <Bell size={20} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
            title="Settings"
            aria-label="Settings"
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