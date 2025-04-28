import React, { useEffect, useRef } from 'react';

const TradingViewEconomicCalendar: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": 400,
      "locale": "en",
      "importanceFilter": "0,1,2",
      "colorTheme": "dark",
      "isTransparent": false
    });
    container.current?.appendChild(script);
    return () => { if (container.current) container.current.innerHTML = ''; };
  }, []);
  return <div ref={container} className="bg-gray-800 rounded-lg p-4 mb-4 tradingview-widget-container" />;
};

export default TradingViewEconomicCalendar;
