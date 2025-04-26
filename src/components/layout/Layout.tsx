import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import Footer from './Footer';
import Dashboard from '../dashboard/Dashboard';
import NewsAgent from '../agents/NewsAgent';
import PatternAgent from '../agents/PatternAgent';
import StrategyAgent from '../agents/StrategyAgent';
import EvaluationAgent from '../agents/EvaluationAgent';
import Pipeline from '../pipeline/Pipeline';
import TradeJournal from '../utilities/TradeJournal';
import MarketData from '../utilities/MarketData';
import History from '../utilities/History';

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'news':
        return <NewsAgent />;
      case 'patterns':
        return <PatternAgent />;
      case 'strategy':
        return <StrategyAgent />;
      case 'backtest':
        return <EvaluationAgent />;
      case 'pipeline':
        return <Pipeline />;
      case 'trades':
        return <TradeJournal />;
      case 'market':
        return <MarketData />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header className="fixed top-0 w-full z-50" />
      
      <div className="flex pt-16">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 md:ml-64">
          <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <main className="flex-1 p-4 lg:p-6">
              {renderContent()}
            </main>
            <Footer />
          </div>
        </div>
      </div>
      
      <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;