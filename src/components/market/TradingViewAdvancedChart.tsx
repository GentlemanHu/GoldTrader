import React, { useEffect, useRef } from 'react';

const TradingViewAdvancedChart: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": 500,
      "symbol": "OANDA:XAUUSD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#131722",
      "enable_publishing": false,
      "allow_symbol_change": false,
      "calendar": true,
      "hide_side_toolbar": false,
      "support_host": "https://www.tradingview.com"
    });
    container.current?.appendChild(script);
    return () => { if (container.current) container.current.innerHTML = ''; };
  }, []);
  return <div ref={container} className="bg-gray-800 rounded-lg p-2 mb-4 tradingview-widget-container" />;
};

export default TradingViewAdvancedChart;
