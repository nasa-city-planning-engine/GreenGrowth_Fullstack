// src/components/MapView.tsx

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LegendMap from "./legend";
import { useCoordinates } from "../coordinateProvider";

// Fix for default marker icon issue
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Define the structure for legend items and layer data
interface LegendItem {
  color: string;
  label: string;
}

interface LayerData {
  url: string;
  legend: {
    title: string;
    items: LegendItem[];
  };
}

// Hardcode legend data for each layer type
const legendData = {
  temp: {
    title: "Temperature (°C)",
    items: [
      { color: "#8B0000", label: "> 40" },
      { color: "#FF4500", label: "30 - 40" },
      { color: "#FFD700", label: "20 - 30" },
      { color: "#00BFFF", label: "10 - 20" },
      { color: "#00008B", label: "< 10" },
    ],
  },
  aq: {
    title: "Air Quality Index (AQI)",
    items: [
      { color: "#009966", label: "Good (0-50)" },
      { color: "#FFDE33", label: "Moderate (51-100)" },
      { color: "#FF9933", label: "Unhealthy (101-150)" },
      { color: "#CC0033", label: "Very Unhealthy (151-200)" },
      { color: "#660099", label: "Hazardous (201+)" },
    ],
  },
  ndvi: {
    title: "Vegetation Index (NDVI)",
    items: [
      { color: "#2d9c43", label: "High Vegetation" },
      { color: "#9cdb5f", label: "Moderate Vegetation" },
      { color: "#f9dd63", label: "Low Vegetation" },
      { color: "#d1a065", label: "Bare Soil" },
      { color: "#f2f2f2", label: "No Data / Clouds" },
    ],
  },
};

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

const MapView: React.FC = () => {
  const [layers, setLayers] = useState<{ [key: string]: LayerData }>({});
  const [activeLayerKey, setActiveLayerKey] = useState<string | null>(null);
  const { coordinates } = useCoordinates();

  const position: [number, number] = [coordinates.lat, coordinates.lng];
  const zoom = 9;

  useEffect(() => {
    const fetchAllLayers = async () => {
      try {
        const layerKeys = ["temp", "aq", "ndvi"];
        const requests = layerKeys.map((key) =>
          fetch(`http://127.0.0.1:5000/api/layers/base/${key}`).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch ${key} layer`);
            return res.json();
          })
        );

        const results = await Promise.all(requests);

        const newLayers = {
          temp: { url: results[0].tile_url, legend: legendData.temp },
          aq: { url: results[1].tile_url, legend: legendData.aq },
          ndvi: { url: results[2].tile_url, legend: legendData.ndvi },
        };

        setLayers(newLayers);
        console.log("✅ All layers fetched successfully:", newLayers);
        setActiveLayerKey("temp");
      } catch (error) {
        console.error("❌ Failed to fetch one or more tile layers:", error);
      }
    };

    fetchAllLayers();
  }, []);

  const activeLayer = activeLayerKey ? layers[activeLayerKey] : null;

  return (
    <div
      className="relative w-full mx-auto h-[500px] rounded-xl overflow-hidden"
      style={{
        backgroundColor: "#EEF8FB",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Layer Control Buttons */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        {Object.keys(layers).map((key) => (
          <button
            key={key}
            onClick={() => setActiveLayerKey(key)}
            className={`px-3 py-1 text-sm font-semibold rounded-md shadow-md transition-colors ${
              activeLayerKey === key
                ? "bg-green-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            {layers[key].legend.title}
          </button>
        ))}
        {activeLayerKey && (
          <button
            onClick={() => setActiveLayerKey(null)}
            className="px-3 py-1 text-sm font-semibold bg-gray-300 text-gray-900 rounded-md shadow-md hover:bg-gray-400 transition-colors"
          >
            Hide Layer
          </button>
        )}
      </div>

      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-3/4"
        style={{ borderRadius: "10px solid #ccc" }}
      >
        {/* ESTE ES EL CAMBIO CLAVE */}
        <ChangeMapView center={position} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeLayer && (
          <TileLayer
            key={activeLayerKey}
            url={activeLayer.url}
            attribution="Custom Layer Data"
            opacity={0.75}
            zIndex={10}
          />
        )}

        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold">Location</p>
              <p>
                Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {activeLayer && (
        <LegendMap
          title={activeLayer.legend.title}
          items={activeLayer.legend.items}
        />
      )}
    </div>
  );
};

export default MapView;
