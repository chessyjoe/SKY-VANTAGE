import { GeoJsonCollection, GeoJsonFeature } from './types';

export const NAIROBI_COORDINATES = {
  longitude: 36.8219,
  latitude: -1.2921
};

export const INITIAL_VIEW_STATE = {
  longitude: 38.0,
  latitude: 0.0,
  zoom: 1.5,
  pitch: 0,
  bearing: 0
};

export const CITY_VIEW_STATE = {
  longitude: NAIROBI_COORDINATES.longitude,
  latitude: NAIROBI_COORDINATES.latitude,
  zoom: 15.5,
  pitch: 60,
  bearing: 20
};

// Procedurally generate "fake" buildings around Nairobi so we don't need external files
export const generateNairobiBuildings = (count: number = 300): GeoJsonCollection => {
  const features: GeoJsonFeature[] = [];
  const centerLat = NAIROBI_COORDINATES.latitude;
  const centerLng = NAIROBI_COORDINATES.longitude;

  for (let i = 0; i < count; i++) {
    // Random position offset from center
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    
    const baseLat = centerLat + latOffset;
    const baseLng = centerLng + lngOffset;

    // Building footprint size
    const size = 0.0003 + Math.random() * 0.0003;
    
    // Create a square polygon
    const coordinates = [[
      [baseLng - size, baseLat - size],
      [baseLng + size, baseLat - size],
      [baseLng + size, baseLat + size],
      [baseLng - size, baseLat + size],
      [baseLng - size, baseLat - size] // Close the loop
    ]];

    // Strategic Metrics Logic (Mock "Meaning Engine")
    // Buildings closer to center have higher price and traffic
    const distFromCenter = Math.sqrt(latOffset*latOffset + lngOffset*lngOffset);
    const normalizedDist = 1 - Math.min(distFromCenter / 0.015, 1);
    
    const priceScore = (normalizedDist * 0.8) + (Math.random() * 0.2);
    const trafficScore = (normalizedDist * 0.6) + (Math.random() * 0.4);
    const height = 20 + (normalizedDist * 150) + (Math.random() * 50);

    features.push({
      type: 'Feature',
      properties: {
        id: `bldg-${i}`,
        height: height,
        priceScore: parseFloat(priceScore.toFixed(2)),
        trafficScore: parseFloat(trafficScore.toFixed(2)),
        name: `Plot ${1000 + i}`
      },
      geometry: {
        type: 'Polygon',
        coordinates: coordinates
      }
    });
  }

  return {
    type: 'FeatureCollection',
    features
  };
};

export const MOCK_BUILDINGS = generateNairobiBuildings(400);