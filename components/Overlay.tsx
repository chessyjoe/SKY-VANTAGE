import React, { useState } from 'react';
import { ViewMode, MetricType, GeminiInsight } from '../types';
import { analyzeUrbanData } from '../services/geminiService';

interface OverlayProps {
  viewMode: ViewMode;
  onEnter: () => void;
  metric: MetricType;
  onMetricChange: (m: MetricType) => void;
}

const Overlay: React.FC<OverlayProps> = ({ viewMode, onEnter, metric, onMetricChange }) => {
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    if (metric === MetricType.NONE) return;
    setLoading(true);
    const result = await analyzeUrbanData(metric);
    setInsight(result);
    setLoading(false);
  };

  if (viewMode === ViewMode.ORBIT) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
        <div className="text-center space-y-4 animate-fade-in-up pointer-events-auto">
          <h1 className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-[0_0_15px_rgba(0,200,255,0.5)]">
            SKYVANTAGE
          </h1>
          <p className="text-xl text-blue-200 tracking-widest uppercase opacity-80">
            Kenya Strategic Initiative
          </p>
          <button
            onClick={onEnter}
            className="mt-8 px-8 py-3 bg-blue-600/20 border border-blue-400 text-blue-100 hover:bg-blue-600/40 hover:scale-105 transition-all duration-300 rounded-sm backdrop-blur-md font-rajdhani font-bold text-lg tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            INITIATE DESCENT
          </button>
        </div>
      </div>
    );
  }

  // City View HUD
  const isCity = viewMode === ViewMode.CITY;
  
  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isCity ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-widest font-rajdhani">NAIROBI <span className="text-blue-500 text-sm align-top">LIVE</span></h2>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 font-mono">
            <span>LAT: -1.2921</span>
            <span>LNG: 36.8219</span>
            <span className="text-emerald-500">CONN: STABLE</span>
          </div>
        </div>
        
        {/* Metric Toggles */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => { onMetricChange(MetricType.PRICE); setInsight(null); }}
            className={`px-4 py-2 border backdrop-blur-md transition-all font-rajdhani font-bold tracking-wider ${metric === MetricType.PRICE ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500'}`}
          >
            PRICE HEATMAP
          </button>
          <button
            onClick={() => { onMetricChange(MetricType.TRAFFIC); setInsight(null); }}
            className={`px-4 py-2 border backdrop-blur-md transition-all font-rajdhani font-bold tracking-wider ${metric === MetricType.TRAFFIC ? 'border-red-500 bg-red-500/20 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500'}`}
          >
            TRAFFIC DENSITY
          </button>
        </div>
      </div>

      {/* Right Side Analysis Panel */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 p-6 flex flex-col items-end pointer-events-auto">
        {metric !== MetricType.NONE && (
          <div className="w-80 bg-black/60 border border-gray-800 backdrop-blur-lg p-6 rounded-sm shadow-2xl relative overflow-hidden group">
            {/* Decoration Lines */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500"></div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-200 font-rajdhani">INTELLIGENCE</h3>
              {!loading && !insight && (
                 <button 
                 onClick={handleAnalysis}
                 className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-sm transition-colors"
               >
                 RUN AI SCAN
               </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-blue-300 font-mono animate-pulse">PROCESSING TELEMETRY...</p>
              </div>
            ) : insight ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-white font-semibold text-sm uppercase border-b border-gray-700 pb-1 mb-2">{insight.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{insight.content}</p>
                </div>
                <div className="bg-emerald-900/30 border border-emerald-800/50 p-3 rounded">
                  <span className="text-emerald-400 text-xs font-bold uppercase block mb-1">Recommendation</span>
                  <p className="text-emerald-200 text-xs">{insight.recommendation}</p>
                </div>
                <button onClick={() => setInsight(null)} className="text-xs text-gray-500 hover:text-white underline w-full text-right">Clear</button>
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic border-l-2 border-gray-700 pl-3">
                Select a data layer to enable SkyVantage AI analysis modules.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 w-full p-4 border-t border-white/10 bg-black/80 backdrop-blur-md flex justify-between items-center text-xs font-mono text-gray-500">
        <div className="flex gap-6">
          <span>SYS: ONLINE</span>
          <span>MODE: {viewMode}</span>
          <span>LAYER: {metric.toUpperCase()}</span>
        </div>
        <div className="flex gap-2">
           <div className="w-20 h-1 bg-gray-800 rounded overflow-hidden">
             <div className="h-full bg-blue-500 animate-pulse w-2/3"></div>
           </div>
           <span>MEM: 45%</span>
        </div>
      </div>

    </div>
  );
};

export default Overlay;