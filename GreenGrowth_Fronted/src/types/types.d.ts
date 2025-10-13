import L from "leaflet";

export type ZoneType = "verde" | "residencial" | "industrial";

export interface Zone {
  id: number;
  type: ZoneType;
  polygon: L.Polygon;
  area: number;
  points: L.LatLng[];
  backendId?: string;
}

export interface LegendItem {
  color: string;
  label: string;
}

export interface LayerData {
  url: string;
  legend: {
    title: string;
    items: LegendItem[];
  };
}

export interface PolygonDrawerProps {
  onEnvironmentUpdate?: (data: any) => void;
  buffer?: number;
  useMockData?: boolean;
}