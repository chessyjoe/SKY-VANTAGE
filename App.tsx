import React, { useState, useCallback } from 'react';
import MapVisualizer from './components/MapVisualizer';
import Overlay from './components/Overlay';
import { ViewMode, MetricType } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ORBIT);
  const [metric, setMetric] = useState<MetricType>(MetricType.NONE);

  const handleEnter = useCallback(() => {
    setViewMode(ViewMode.TRANSITIONING);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setViewMode(ViewMode.CITY);
    // Auto-select a metric once arrived to show off the meaning engine
    setTimeout(() => {
        setMetric(MetricType.PRICE);
    }, 1000);
  }, []);

  const handleMetricChange = useCallback((newMetric: MetricType) => {
    setMetric(newMetric);
  }, []);

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* The 3D World */}
      <MapVisualizer 
        viewMode={viewMode} 
        metric={metric} 
        onTransitionComplete={handleTransitionComplete} 
      />

      {/* The UI Overlay (HUD) */}
      <Overlay 
        viewMode={viewMode} 
        onEnter={handleEnter} 
        metric={metric} 
        onMetricChange={handleMetricChange}
      />
      
      {/* Vignette Effect for immersion */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
};

export default App;