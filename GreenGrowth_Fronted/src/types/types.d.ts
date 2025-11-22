import L from "leaflet";

export type ZoneType = "industrial zone" | "residential zone" | "green zone";


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

export interface KPIData {
  temp: number | null;
  AQ: number | null;
  NDVI: number | null;
}