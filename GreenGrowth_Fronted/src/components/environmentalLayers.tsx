import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { LayersControl, LayerGroup, TileLayer } from "react-leaflet";
import { useCoordinates } from "../others/coordinateProvider";
import type { LayerData, PolygonDrawerProps } from "../types/types";
import Legend from "./legend";
import { legendData } from "../types/consts";
import { fetchAllEnvironmentalLayers } from "../others/apiBack";

const { BaseLayer } = LayersControl;

const EnvironmentalLayers: React.FC<PolygonDrawerProps> = ({
  buffer = 50000,
}) => {
  const { coordinates } = useCoordinates();
  const [layers, setLayers] = useState<Record<string, LayerData>>({});
  const [activeLayerKey, setActiveLayerKey] = useState<string | null>(null);

  // 🔹 Cargar capas
  useEffect(() => {
    const loadLayers = async () => {
      console.log("🔄 Loading environmental layers...");
      try {
        const rawLayers = await fetchAllEnvironmentalLayers(
          coordinates.lat,
          coordinates.lng,
          buffer
        );

        const formatted: Record<string, LayerData> = {};
        Object.entries(rawLayers).forEach(([key, payload]) => {
          const originalUrl = payload.url as string;
          const proxiedUrl = originalUrl.replace(
            "https://earthengine.googleapis.com",
            "/gee-proxy"
          );

          formatted[key] = {
            url: proxiedUrl,
            legend: legendData[key as keyof typeof legendData],
          };
        });

        setLayers(formatted);
        console.log(`✅ Loaded ${Object.keys(formatted).length} layers`);
      } catch (err) {
        console.error("❌ Error loading layers:", err);
      }
    };

    loadLayers();
  }, [coordinates.lat, coordinates.lng, buffer]);

  const activeLayer = activeLayerKey ? layers[activeLayerKey] : null;

  return (
    <>
      <LayersControl position="topright">
        <BaseLayer checked name="Default Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        {Object.entries(layers).map(([key, layer]) => (
          <BaseLayer key={key} checked={false} name={layer.legend.title}>
            <LayerGroup
              eventHandlers={{
                add: () => setActiveLayerKey(key),
                remove: () => setActiveLayerKey(null),
              }}
            >
              <TileLayer
                attribution="Environmental Data"
                url={layer.url}
                opacity={0.75}
                maxNativeZoom={12}
                maxZoom={19}
                keepBuffer={8}
                crossOrigin={true}
                className="blend-multiply"
              />
            </LayerGroup>
          </BaseLayer>
        ))}
      </LayersControl>

      <Legend activeLayer={activeLayer} />
    </>
  );
};
export default EnvironmentalLayers;
