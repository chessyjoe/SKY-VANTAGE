import React, { useEffect, useMemo, useState } from 'react';
import Map, { MapRef, Source, Layer, FillExtrusionLayerSpecification } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { MOCK_BUILDINGS, INITIAL_VIEW_STATE, CITY_VIEW_STATE } from '../constants';
import { ViewMode, MetricType } from '../types';

// MapLibre is lightweight and allows for the 3D globe projection
interface MapVisualizerProps {
  viewMode: ViewMode;
  metric: MetricType;
  onTransitionComplete: () => void;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ viewMode, metric, onTransitionComplete }) => {
  const mapRef = React.useRef<MapRef>(null);
  
  // We manage view state locally to allow flyTo animations
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  useEffect(() => {
    if (viewMode === ViewMode.TRANSITIONING && mapRef.current) {
      // Trigger the fly animation
      mapRef.current.flyTo({
        center: [CITY_VIEW_STATE.longitude, CITY_VIEW_STATE.latitude],
        zoom: CITY_VIEW_STATE.zoom,
        pitch: CITY_VIEW_STATE.pitch,
        bearing: CITY_VIEW_STATE.bearing,
        duration: 4000, // 4 seconds flight
        essential: true
      });

      // Listen for moveend to signal completion
      const onMoveEnd = () => {
        onTransitionComplete();
        mapRef.current?.off('moveend', onMoveEnd);
      };
      mapRef.current.on('moveend', onMoveEnd);
    }
  }, [viewMode, onTransitionComplete]);

  // Dynamic Coloring Logic based on Metric
  const buildingLayerStyle = useMemo((): FillExtrusionLayerSpecification => {
    let colorExpression: any = ['rgb', 200, 200, 200]; // Default Grey

    if (metric === MetricType.PRICE) {
      // Interpolate Red (High Price) to Green (Low Price)
      colorExpression = [
        'interpolate',
        ['linear'],
        ['get', 'priceScore'],
        0, ['rgb', 0, 255, 100], // Green
        0.5, ['rgb', 255, 255, 0], // Yellow
        1, ['rgb', 255, 50, 50]   // Red
      ];
    } else if (metric === MetricType.TRAFFIC) {
      // Interpolate Red (High Traffic) to Blue (Low Traffic)
      colorExpression = [
        'interpolate',
        ['linear'],
        ['get', 'trafficScore'],
        0, ['rgb', 50, 100, 255], // Blue
        0.5, ['rgb', 200, 100, 200], // Purple
        1, ['rgb', 255, 50, 0]   // Red
      ];
    }

    return {
      id: '3d-buildings',
      type: 'fill-extrusion',
      paint: {
        'fill-extrusion-color': colorExpression,
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.9
      }
    };
  }, [metric]);

  return (
    <div className="w-full h-full absolute top-0 left-0 bg-black">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
        projection="globe" // This enables the 3D globe view at low zoom
        attributionControl={false}
        logoPosition="bottom-right"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Atmosphere / Star background is handled by map style usually, but we keep it simple */}
        
        {/* Building Data Source */}
        <Source id="nairobi-buildings" type="geojson" data={MOCK_BUILDINGS}>
          <Layer {...buildingLayerStyle} />
        </Source>

        {/* Optional: Add a subtle glow/fog using background layer properties if supported by style */}
      </Map>
    </div>
  );
};

export default MapVisualizer;