import React, { useEffect, useRef } from 'react';

const TradingViewSymbolInfo: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": "OANDA:XAUUSD",
      "width": "100%",
      "locale": "en",
      "colorTheme": "dark",
      "isTransparent": false,
      "largeChartUrl": "",
      "showSymbolLogo": true,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "Inter, sans-serif"
    });
    container.current?.appendChild(script);
    return () => { if (container.current) container.current.innerHTML = ''; };
  }, []);
  return <div ref={container} className="bg-gray-800 rounded-lg p-4 mb-4 tradingview-widget-container" />;
};

/**
 * Note: The 'tradingview-widget-container' class should be styled in the global CSS.
 * It is expected to contain styles for the minimum height of the container.
 */
export default TradingViewSymbolInfo;
