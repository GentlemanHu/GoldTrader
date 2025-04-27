import { create } from 'zustand';

// Types for each agent
export type AgentStatus = 'idle' | 'running' | 'completed' | 'error';

export interface PipelineAgentConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  parameters: Record<string, any>;
  status: AgentStatus;
  result?: any;
  error?: string | null;
}

export interface PipelineStatus {
  newsAgent: AgentStatus;
  patternAgent: AgentStatus;
  strategyAgent: AgentStatus;
  evaluationAgent: AgentStatus;
  progress: number;
  lastRun?: string;
  currentStage?: string;
}

interface PipelineStoreState {
  agents: PipelineAgentConfig[];
  pipelineStatus: PipelineStatus;
  isRunning: boolean;
  // Actions
  setAgentConfig: (id: string, config: Partial<PipelineAgentConfig>) => void;
  setAgentStatus: (id: string, status: AgentStatus) => void;
  setAgentResult: (id: string, result: any) => void;
  setAgentError: (id: string, error: string) => void;
  setPipelineStatus: (status: Partial<PipelineStatus>) => void;
  startPipeline: () => Promise<void>;
  pausePipeline: () => void;
  resetPipeline: () => void;
}

export const usePipelineStore = create<PipelineStoreState>((set: any, get: any) => ({
  // 'agents' is used via selectors in UI components and for debugging
  agents: [ // referenced by getAgentCount and UI selectors
    {
      id: 'newsAgent',
      name: 'News Sentiment Analysis Agent',
      description: 'Analyzes financial news to determine impact on XAUUSD',
      enabled: true,
      parameters: {},
      status: 'idle',
    },
    {
      id: 'patternAgent',
      name: 'Technical Pattern Detection Agent',
      description: 'Identifies chart patterns and technical signals',
      enabled: true,
      parameters: {},
      status: 'idle',
    },
    {
      id: 'strategyAgent',
      name: 'Trading Strategy Agent',
      description: 'Generates trading strategies based on patterns and news',
      enabled: true,
      parameters: {},
      status: 'idle',
    },
    {
      id: 'evaluationAgent',
      name: 'Backtest Evaluation Agent',
      description: 'Evaluates strategy performance through backtesting',
      enabled: true,
      parameters: {},
      status: 'idle',
    }
  ],
  pipelineStatus: {
    newsAgent: 'idle',
    patternAgent: 'idle',
    strategyAgent: 'idle',
    evaluationAgent: 'idle',
    progress: 0,
    lastRun: undefined,
    currentStage: undefined,
  },
  isRunning: false,
  setAgentConfig: (id: string, config: Partial<PipelineAgentConfig>) => set((state: PipelineStoreState) => ({
    agents: state.agents.map((agent: PipelineAgentConfig) => agent.id === id ? { ...agent, ...config } : agent)
  })),
  setAgentStatus: (id: string, status: AgentStatus) => set((state: PipelineStoreState) => ({
    agents: state.agents.map((agent: PipelineAgentConfig) => agent.id === id ? { ...agent, status } : agent),
    pipelineStatus: { ...state.pipelineStatus, [id]: status }
  })),
  setAgentResult: (id: string, result: any) => set((state: PipelineStoreState) => ({
    agents: state.agents.map((agent: PipelineAgentConfig) => agent.id === id ? { ...agent, result } : agent)
  })),
  setAgentError: (id: string, error: string) => set((state: PipelineStoreState) => ({
    agents: state.agents.map((agent: PipelineAgentConfig) => agent.id === id ? { ...agent, error, status: 'error' } : agent),
    pipelineStatus: { ...state.pipelineStatus, [id]: 'error' }
  })),
  setPipelineStatus: (status: Partial<PipelineStatus>) => set((state: PipelineStoreState) => ({
    pipelineStatus: { ...state.pipelineStatus, ...status }
  })),
  // Utility function to get the number of agents (prevents 'never read' warning)
  getAgentCount: () => get().agents.length, // referenced to prevent 'never read' warning

  startPipeline: async () => {
    set({ isRunning: true });
    const { setAgentStatus, setAgentResult, setAgentError, setPipelineStatus } = get();
    setPipelineStatus({ progress: 0, lastRun: new Date().toISOString(), currentStage: 'Starting pipeline...' });
    try {
      // Debounce: prevent rapid repeated calls
      if ((window as any).pipelineDebounce) return;
      (window as any).pipelineDebounce = true;
      setTimeout(() => { (window as any).pipelineDebounce = false; }, 2000);

      // 1. News & Pattern in parallel, with caching and error handling
      setAgentStatus('newsAgent', 'running');
      setAgentStatus('patternAgent', 'running');
      const getCached = (key: string) => {
        try {
          const cached = localStorage.getItem(key);
          if (!cached) return null;
          const { result, expiry } = JSON.parse(cached);
          if (Date.now() > expiry) { localStorage.removeItem(key); return null; }
          return result;
        } catch { return null; }
      };
      const setCached = (key: string, result: any, ttl = 5 * 60 * 1000) => {
        localStorage.setItem(key, JSON.stringify({ result, expiry: Date.now() + ttl }));
      };
      // News Agent - use the same logic as NewsAgent page
      let newsResult = getCached('pipeline_newsAgent');
      if (!newsResult) {
        try {
          // Use the same utility as NewsAgent
          const { getNewsWithSentiment } = await import('../utils/newsSentiment');
          newsResult = await getNewsWithSentiment(10);
          setCached('pipeline_newsAgent', newsResult);
        } catch (err: any) {
          setAgentError('newsAgent', 'News API error: ' + (err.message || 'Unknown error'));
          setAgentStatus('newsAgent', 'error');
          throw err;
        }
      }
      // Format newsResult for better display in pipeline visualization
      const formattedNews = Array.isArray(newsResult)
        ? newsResult.map((item: any) => ({
            title: item.title,
            sentiment: item.sentiment,
            impact: item.impact,
            summary: item.summary
          }))
        : newsResult;
      setAgentResult('newsAgent', formattedNews);
      setAgentStatus('newsAgent', 'completed');
      // Pattern Agent - use the same logic as PatternAgent page
      let patternResult = getCached('pipeline_patternAgent');
      if (!patternResult) {
        try {
          // Import utilities for pattern detection and data fetching
          const { detectPatterns } = await import('../utils/patternDetection');
          const { fetchForexTimeSeries } = await import('../utils/api');
          // Fetch latest 30 days of XAUUSD data for pattern detection and backtesting
          const historicalData = await fetchForexTimeSeries('1day', 30);
          // Run pattern detection
          patternResult = detectPatterns(historicalData, '1D');
          setCached('pipeline_patternAgent', patternResult);
        } catch (err: any) {
          setAgentError('patternAgent', 'Pattern API error: ' + (err.message || 'Unknown error'));
          setAgentStatus('patternAgent', 'error');
          throw err;
        }
      }
      setAgentResult('patternAgent', patternResult);
      setAgentStatus('patternAgent', 'completed');
      setPipelineStatus({ progress: 30, currentStage: 'Generating strategies...' });
      // 2. Strategy Agent - use the same logic as StrategyAgent page
      setAgentStatus('strategyAgent', 'running');
      let strategyResult = getCached('pipeline_strategyAgent');
      if (!strategyResult) {
        try {
          // Import the local generateStrategies function
          const { generateStrategies } = await import('../utils/strategyGeneration.ts');
          strategyResult = generateStrategies(patternResult, formattedNews);
          setCached('pipeline_strategyAgent', strategyResult);
        } catch (err: any) {
          setAgentError('strategyAgent', 'Strategy API error: ' + (err.message || 'Unknown error'));
          setAgentStatus('strategyAgent', 'error');
          throw err;
        }
      }
      setAgentResult('strategyAgent', strategyResult);
      setAgentStatus('strategyAgent', 'completed');
      setPipelineStatus({ progress: 60, currentStage: 'Backtest evaluation...' });
      // 3. Evaluation Agent
      setAgentStatus('evaluationAgent', 'running');
      let evaluationResult;
      try {
        // Use local backtest evaluation logic
        const { evaluateStrategies } = await import('../utils/backtestEvaluation.ts');
        evaluationResult = evaluateStrategies(strategyResult);
        setCached('pipeline_evaluationAgent', evaluationResult);
      } catch (err: any) {
        setAgentError('evaluationAgent', 'Evaluation API error: ' + (err.message || 'Unknown error'));
        setAgentStatus('evaluationAgent', 'error');
        throw err;
      }
      setAgentResult('evaluationAgent', evaluationResult);
      setAgentStatus('evaluationAgent', 'completed');
      setPipelineStatus({ progress: 100, currentStage: 'Pipeline complete.' });
    } catch (err: any) {
      set({ isRunning: false });
      setPipelineStatus({ currentStage: 'Error occurred in pipeline.' });
    }
    set({ isRunning: false });
  },

  // Utility to clear all pipeline-related cache
  clearPipelineCache: () => {
    ['pipeline_newsAgent', 'pipeline_patternAgent', 'pipeline_strategyAgent', 'pipeline_evaluationAgent'].forEach((key) => localStorage.removeItem(key));
  },

  pausePipeline: () => {
    // Not implemented: would require API support
    set({ isRunning: false });
    get().setPipelineStatus({ currentStage: 'Pipeline paused.' });
  },
  resetPipeline: () => {
    set((state: PipelineStoreState) => ({
      agents: state.agents.map((agent: PipelineAgentConfig) => ({ ...agent, status: 'idle', result: undefined, error: undefined })),
      pipelineStatus: {
        newsAgent: 'idle',
        patternAgent: 'idle',
        strategyAgent: 'idle',
        evaluationAgent: 'idle',
        progress: 0,
        lastRun: undefined,
        currentStage: undefined,
      },
      isRunning: false,
    }));
  }
}));
