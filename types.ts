export enum ViewMode {
  ORBIT = 'ORBIT',
  TRANSITIONING = 'TRANSITIONING',
  CITY = 'CITY'
}

export enum MetricType {
  PRICE = 'price',
  TRAFFIC = 'traffic',
  NONE = 'none'
}

export interface BuildingProperties {
  id: string;
  height: number;
  priceScore: number; // 0.0 to 1.0 (Low to High)
  trafficScore: number; // 0.0 to 1.0 (Low to High)
  name: string;
}

export interface GeminiInsight {
  title: string;
  content: string;
  recommendation: string;
}

// GeoJSON types
export interface GeoJsonFeature {
  type: 'Feature';
  properties: BuildingProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface GeoJsonCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}