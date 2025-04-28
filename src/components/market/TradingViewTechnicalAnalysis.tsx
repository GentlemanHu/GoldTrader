import React, { useEffect, useRef } from 'react';

const TradingViewTechnicalAnalysis: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1D",
      "width": "100%",
      "isTransparent": false,
      "height": 400,
      "symbol": "OANDA:XAUUSD",
      "showIntervalTabs": true,
      "locale": "en",
      "colorTheme": "dark"
    });
    container.current?.appendChild(script);
    return () => { if (container.current) container.current.innerHTML = ''; };
  }, []);
  return <div ref={container} className="bg-gray-800 rounded-lg p-4 mb-4 tradingview-widget-container" />;
};

export default TradingViewTechnicalAnalysis;
