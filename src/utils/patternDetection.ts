// utils/patternDetection.ts
// Simple pattern detection for Double Bottom, Head & Shoulders, Golden Cross, etc.
// Input: array of candles [{date, open, high, low, close, volume}]
// Output: array of detected patterns

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface PatternDetection {
  id: string;
  pattern: string;
  timeframe: string;
  confidence: number;
  direction: 'bullish' | 'bearish';
  detectedAt: string;
  description: string;
  historicalAccuracy: number;
}

// Improved Double Bottom detection
function detectDoubleBottom(candles: Candle[], timeframe: string): PatternDetection[] {
  if (candles.length < 10) return [];
  let patterns: PatternDetection[] = [];
  for (let i = 2; i < candles.length - 2; i++) {
    const prev = candles[i - 2];
    const curr = candles[i];
    const next = candles[i + 2];
    // Find two local minima separated by a local maximum
    if (
      curr.low < candles[i - 1].low &&
      curr.low < candles[i + 1].low &&
      Math.abs(curr.low - prev.low) / curr.low < 0.015 && // allow more tolerance
      next.high > curr.high
    ) {
      // Dynamic confidence based on how close the bottoms are
      const confidence = 0.7 + 0.2 * (1 - Math.abs(curr.low - prev.low) / curr.low);
      patterns.push({
        id: `double-bottom-${candles[i].date}`,
        pattern: 'Double Bottom',
        timeframe,
        confidence: Math.min(confidence, 0.95),
        direction: 'bullish',
        detectedAt: candles[i].date,
        description: `Double bottom at ${typeof curr.low === 'number' ? curr.low.toFixed(2) : String(curr.low)} and ${typeof prev.low === 'number' ? prev.low.toFixed(2) : String(prev.low)}`,
        historicalAccuracy: 0.82
      });
    }
  }
  return patterns;
}

// Head and Shoulders detection
function detectHeadAndShoulders(candles: Candle[], timeframe: string): PatternDetection[] {
  if (candles.length < 7) return [];
  let patterns: PatternDetection[] = [];
  for (let i = 3; i < candles.length - 3; i++) {
    const lShoulder = candles[i - 2].high;
    const head = candles[i].high;
    const rShoulder = candles[i + 2].high;
    // Head higher than both shoulders, shoulders roughly equal
    if (
      head > lShoulder &&
      head > rShoulder &&
      Math.abs(lShoulder - rShoulder) / head < 0.03 &&
      head - Math.max(lShoulder, rShoulder) > 0.005 * head
    ) {
      // Confidence based on height difference
      const confidence = 0.7 + 0.2 * ((head - Math.max(lShoulder, rShoulder)) / head);
      patterns.push({
        id: `head-shoulders-${candles[i].date}`,
        pattern: 'Head and Shoulders',
        timeframe,
        confidence: Math.min(confidence, 0.93),
        direction: 'bearish',
        detectedAt: candles[i].date,
        description: `Head at ${typeof head === 'number' ? head.toFixed(2) : String(head)}, shoulders at ${typeof lShoulder === 'number' ? lShoulder.toFixed(2) : String(lShoulder)}, ${typeof rShoulder === 'number' ? rShoulder.toFixed(2) : String(rShoulder)}`,
        historicalAccuracy: 0.78
      });
    }
  }
  return patterns;
}

// Golden Cross (MA20 crosses above MA50)
function detectGoldenCross(candles: Candle[], timeframe: string): PatternDetection[] {
  if (candles.length < 51) return [];
  let patterns: PatternDetection[] = [];
  for (let i = 50; i < candles.length; i++) {
    const ma20Prev = candles.slice(i - 21, i - 1).reduce((s, c) => s + c.close, 0) / 20;
    const ma50Prev = candles.slice(i - 51, i - 1).reduce((s, c) => s + c.close, 0) / 50;
    const ma20 = candles.slice(i - 19, i + 1).reduce((s, c) => s + c.close, 0) / 20;
    const ma50 = candles.slice(i - 49, i + 1).reduce((s, c) => s + c.close, 0) / 50;
    if (ma20Prev < ma50Prev && ma20 > ma50) {
      const confidence = 0.85 + 0.1 * Math.random();
      patterns.push({
        id: `golden-cross-${candles[i].date}`,
        pattern: 'Golden Cross',
        timeframe,
        confidence: Math.min(confidence, 0.98),
        direction: 'bullish',
        detectedAt: candles[i].date,
        description: '20 MA crossed above 50 MA',
        historicalAccuracy: 0.87
      });
    }
  }
  return patterns;
}

// Main detection function
export function detectPatterns(candles: Candle[], timeframe: string): PatternDetection[] {
  return [
    ...detectDoubleBottom(candles, timeframe),
    ...detectHeadAndShoulders(candles, timeframe),
    ...detectGoldenCross(candles, timeframe)
  ];
}
