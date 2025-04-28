import React from 'react';
import { Github, Twitter, Mail, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/goldtrader-logo.svg" alt="GoldTrader Logo" className="w-8 h-8 mr-2 rounded-md bg-white p-0.5" />
              <h3 className="text-white font-semibold text-lg">
                GoldTrader<span className="text-amber-500">AI</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              Advanced algorithmic trading platform for XAUUSD with AI-powered analysis and automated strategy generation.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>News Sentiment Analysis</li>
              <li>Pattern Detection</li>
              <li>Strategy Generation</li>
              <li>Automated Backtesting</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Market Data</li>
              <li>Trading Guide</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                support@goldtrader.ai
              </li>
              <li className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                www.goldtrader.ai
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white" title="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" title="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} GoldTrader AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;