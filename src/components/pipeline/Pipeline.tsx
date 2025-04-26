import React from 'react';
import PipelineStatus from '../widgets/PipelineStatus';
import { mockPipelineStatus, mockAgentConfigs } from '../../utils/mockData';
import { Settings, Play, PauseCircle, ArrowRightCircle, Workflow, Save } from 'lucide-react';

const Pipeline: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Pipeline Management</h1>
          <p className="text-gray-400">
            Configure and control the trading strategy pipeline
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center py-2 px-3 bg-gray-800 text-white rounded hover:bg-gray-700">
            <Save className="h-4 w-4 mr-2" />
            <span>Save Pipeline</span>
          </button>
          <button className="flex items-center py-2 px-3 bg-amber-500 text-gray-900 rounded hover:bg-amber-600">
            <Play className="h-4 w-4 mr-2" />
            <span>Run Pipeline</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Pipeline Visualization</h3>
          
          <div className="relative py-4">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 transform -translate-x-1/2"></div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="flex items-center justify-center relative">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center relative z-10">
                  <Workflow className="h-6 w-6 text-gray-900" />
                </div>
                <div className="absolute transform -translate-y-full top-0 -mt-4 text-center w-full">
                  <span className="text-amber-500 font-medium">Pipeline Start</span>
                </div>
              </div>
              
              {mockAgentConfigs.map((agent, index) => (
                <div key={agent.id} className="relative">
                  <div className="flex flex-col md:flex-row items-center relative">
                    <div className="md:w-5/12 mb-4 md:mb-0 md:pr-4">
                      <div className={`p-3 rounded-lg ${
                        mockPipelineStatus[agent.id as keyof typeof mockPipelineStatus] === 'completed'
                          ? 'bg-green-500 bg-opacity-10 border border-green-500'
                          : mockPipelineStatus[agent.id as keyof typeof mockPipelineStatus] === 'running'
                          ? 'bg-amber-500 bg-opacity-10 border border-amber-500'
                          : 'bg-gray-700'
                      }`}>
                        <h4 className="font-medium text-white">{agent.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{agent.description}</p>
                      </div>
                    </div>
                    
                    <div className="md:absolute left-1/2 transform md:-translate-x-1/2 w-10 h-10 rounded-full z-10 flex items-center justify-center bg-gray-700">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    
                    <div className="md:w-5/12 md:pl-4">
                      <div className="p-3 rounded-lg bg-gray-700">
                        <h5 className="text-xs font-medium text-gray-300 mb-2">Key Parameters</h5>
                        <ul className="text-xs text-gray-400 space-y-1">
                          {Object.entries(agent.parameters).slice(0, 3).map(([key, value]) => (
                            <li key={key} className="flex justify-between">
                              <span>{key}:</span>
                              <span className="text-gray-300">{
                                typeof value === 'boolean'
                                  ? value ? 'Yes' : 'No'
                                  : Array.isArray(value)
                                  ? value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '')
                                  : String(value)
                              }</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {index < mockAgentConfigs.length - 1 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 text-gray-500">
                      <ArrowRightCircle className="transform rotate-90 h-6 w-6" />
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex items-center justify-center relative">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center relative z-10">
                  <Workflow className="h-6 w-6 text-gray-900" />
                </div>
                <div className="absolute transform translate-y-full bottom-0 mt-4 text-center w-full">
                  <span className="text-green-500 font-medium">Pipeline Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <PipelineStatus status={mockPipelineStatus} />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Agent Configuration</h3>
          <button className="p-2 bg-gray-700 rounded-md text-gray-300 hover:text-white">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          {mockAgentConfigs.map(agent => (
            <div key={agent.id} className="bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`enable-${agent.id}`}
                    checked={agent.enabled}
                    className="mr-3 h-4 w-4"
                  />
                  <label htmlFor={`enable-${agent.id}`} className="font-medium text-white">{agent.name}</label>
                </div>
                <button className="p-1 text-gray-400 hover:text-white">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-xs text-gray-400 mb-3">{agent.description}</div>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(agent.parameters).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-gray-400">{key}: </span>
                    <span className="text-gray-300">{
                      typeof value === 'boolean'
                        ? value ? 'Yes' : 'No'
                        : Array.isArray(value)
                        ? value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '')
                        : String(value)
                    }</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <button className="py-2 px-4 bg-gray-700 text-white rounded font-medium text-sm hover:bg-gray-600 transition-colors flex items-center">
            <PauseCircle className="h-4 w-4 mr-2" />
            Pause All
          </button>
          <button className="py-2 px-4 bg-amber-500 text-gray-900 rounded font-medium text-sm hover:bg-amber-600 transition-colors flex items-center">
            <Play className="h-4 w-4 mr-2" />
            Run Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;