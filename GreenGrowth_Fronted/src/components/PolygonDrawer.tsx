import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCoordinates } from "../coordinateProvider";

interface Zone {
  id: number;
  type: ZoneType;
  polygon: L.Polygon;
  area: number;
  points: L.LatLng[];
  backendId?: string;
}

type ZoneType = "verde" | "residencial" | "industrial";

const zoneConfig = {
  verde: { color: "#10b981", name: "Green Zone", icon: "🌳" },
  residencial: { color: "#f59e0b", name: "Residential Zone", icon: "🏘️" },
  industrial: { color: "#6366f1", name: "Industrial Zone", icon: "🏭" },
};

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
    title: "Air Quality (AQI)",
    items: [
      { color: "#009966", label: "Good (0-50)" },
      { color: "#FFDE33", label: "Moderate (51-100)" },
      { color: "#FF9933", label: "Unhealthy for Sensitive Groups (101-150)" },
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

const PolygonDrawer: React.FC<PolygonDrawerProps> = ({
  onEnvironmentUpdate,
  latitude = 29.0729,
  longitude = -110.9559,
  buffer = 50000,
  useMockData = false,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<{ [key: string]: L.TileLayer }>({});

  const [currentZoneType, setCurrentZoneType] = useState<ZoneType | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [currentPoints, setCurrentPoints] = useState<L.LatLng[]>([]);
  const [layers, setLayers] = useState<{ [key: string]: LayerData }>({});
  const [activeLayerKey, setActiveLayerKey] = useState<string | null>(null);

  const tempMarkersRef = useRef<L.CircleMarker[]>([]);
  const tempPolylineRef = useRef<L.Polyline | null>(null);

  const { coordinates } = useCoordinates();

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(
      [coordinates.lat, coordinates.lng],
      11
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  // Load environmental layers
  useEffect(() => {
    const fetchAllLayers = async () => {
      console.log("🔄 Starting environmental layers load...");
      try {
        const params = new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          buffer: buffer.toString(),
        });

        const layerKeys = ["temp", "aq", "ndvi"];

        const results = await Promise.allSettled(
          layerKeys.map(async (key) => {
            console.log(`📡 Requesting layer: ${key}`);
            const url = `http://127.0.0.1:5001/geo/get-initial-data/${key}?${params.toString()}`;
            console.log(`   URL: ${url}`);

            const res = await fetch(url);

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log(`✅ Response for ${key}:`, data);
            return { key, data };
          })
        );

        const validLayers: { [key: string]: LayerData } = {};
        let loadedCount = 0;

        results.forEach((result, index) => {
          const key = layerKeys[index] as "temp" | "aq" | "ndvi";

          if (result.status === "fulfilled") {
            const { data } = result.value;

            if (data && data.payload && data.payload.url) {
              const originalUrl = data.payload.url as string;
              console.log(`🔗 Original URL (${key}):`, originalUrl);

              // Replace Google Earth Engine URL with the local Vite proxy
              const proxiedUrl = originalUrl.replace(
                "https://earthengine.googleapis.com",
                "/gee-proxy"
              );

              console.log(`🔗 Proxied URL (${key}):`, proxiedUrl);

              validLayers[key] = {
                url: proxiedUrl,
                legend: legendData[key],
              };

              loadedCount++;
              console.log(`✅ Layer ${key} configured successfully`);
            } else {
              console.warn(`⚠️ Layer ${key}: incorrect data structure`, data);
            }
          } else {
            console.error(`❌ Error loading layer ${key}:`, result.reason);
          }
        });

        setLayers(validLayers);
        console.log(
          `🎉 ${loadedCount}/${layerKeys.length} layers loaded successfully`
        );
        console.log("📦 Available layers:", Object.keys(validLayers));
      } catch (error) {
        console.error("❌ Critical error loading layers:", error);
      }
    };

    if (mapRef.current) {
      fetchAllLayers();
    }
  }, [latitude, longitude, buffer]);

  // Handle active layer change
  useEffect(() => {
    if (!mapRef.current) return;

    console.log("🔄 Changing active layer to:", activeLayerKey);

    // Remove previous layers
    Object.entries(layerRefs.current).forEach(([key, layer]) => {
      console.log(`🗑️ Removing layer: ${key}`);
      if (mapRef.current) {
        mapRef.current.removeLayer(layer);
      }
    });
    layerRefs.current = {};

    // Add new layer if one is active
    if (activeLayerKey && layers[activeLayerKey]) {
      const layerData = layers[activeLayerKey];
      console.log(`➕ Adding layer ${activeLayerKey}:`, layerData.url);

      const tileLayer = L.tileLayer(layerData.url, {
        attribution: "Environmental Data",
        opacity: 0.7,
        maxZoom: 12,
        crossOrigin: true,
      });

      // Eventos para debugging
      tileLayer.on("loading", () => {
        console.log(`⏳ Loading tiles for ${activeLayerKey}...`);
      });

      tileLayer.on("load", () => {
        console.log(`✅ Tiles loaded successfully for ${activeLayerKey}`);
      });

      tileLayer.on("tileerror", (error: any) => {
        console.error(`❌ Error loading tile for ${activeLayerKey}:`, error);
        console.error("   Tile URL:", error.tile?.src);
      });

      tileLayer.addTo(mapRef.current);
      layerRefs.current[activeLayerKey] = tileLayer;

      console.log(`✅ Layer ${activeLayerKey} added to map`);
    } else {
      console.log("ℹ️ No active layer to display");
    }
  }, [activeLayerKey, layers]);

  // Manejo de clicks en el mapa para dibujar
  useEffect(() => {
    if (!mapRef.current) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawing || !currentZoneType) return;

      const newPoints = [...currentPoints, e.latlng];
      setCurrentPoints(newPoints);

      const marker = L.circleMarker(e.latlng, {
        radius: 6,
        fillColor: zoneConfig[currentZoneType].color,
        fillOpacity: 1,
        color: "white",
        weight: 2,
      }).addTo(mapRef.current!);
      tempMarkersRef.current.push(marker);

      if (newPoints.length > 1) {
        if (tempPolylineRef.current) {
          mapRef.current!.removeLayer(tempPolylineRef.current);
        }
        tempPolylineRef.current = L.polyline(newPoints, {
          color: zoneConfig[currentZoneType].color,
          weight: 3,
          dashArray: "10, 5",
          opacity: 0.8,
        }).addTo(mapRef.current!);
      }
    };

    mapRef.current.on("click", handleMapClick);
    return () => mapRef.current?.off("click", handleMapClick);
  }, [isDrawing, currentZoneType, currentPoints]);

  // Manejo de teclas
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isDrawing && currentPoints.length >= 3) {
        finishPolygon();
      } else if (e.key === "Escape" && isDrawing) {
        cancelDrawing();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isDrawing, currentPoints, currentZoneType]);

  const startDrawing = (type: ZoneType) => {
    clearTempDrawing();
    setCurrentZoneType(type);
    setIsDrawing(true);
    setCurrentPoints([]);
    if (mapRef.current) {
      mapRef.current.getContainer().style.cursor = "crosshair";
    }
  };

  const clearTempDrawing = () => {
    tempMarkersRef.current.forEach((marker) => {
      if (mapRef.current) mapRef.current.removeLayer(marker);
    });
    if (tempPolylineRef.current && mapRef.current) {
      mapRef.current.removeLayer(tempPolylineRef.current);
    }
    tempMarkersRef.current = [];
    tempPolylineRef.current = null;
  };

  const finishPolygon = async () => {
    if (currentPoints.length < 3 || !currentZoneType || !mapRef.current) {
      alert("You need at least 3 points to create a polygon");
      return;
    }

    const polygon = L.polygon(currentPoints, {
      color: zoneConfig[currentZoneType].color,
      fillColor: zoneConfig[currentZoneType].color,
      fillOpacity: 0.35,
      weight: 3,
    }).addTo(mapRef.current);

    const areaM2 = calculateGeodesicArea(polygon.getLatLngs()[0] as L.LatLng[]);

    const newZone: Zone = {
      id: Date.now(),
      type: currentZoneType,
      polygon: polygon,
      area: areaM2,
      points: [...currentPoints],
    };

    polygon.bindPopup(`
      <div style="font-weight: 600; margin-bottom: 4px;">${
        zoneConfig[currentZoneType].icon
      } ${zoneConfig[currentZoneType].name}</div>
      <div style="font-size: 13px; color: #6b7280;">Area: ${formatArea(
        areaM2
      )}</div>
    `);

    clearTempDrawing();
    setIsDrawing(false);
    setCurrentPoints([]);
    setCurrentZoneType(null);
    if (mapRef.current) {
      mapRef.current.getContainer().style.cursor = "";
    }

    const updatedData = await sendZoneToBackend(newZone).catch((error) => {
      console.error("Captured error:", error);
      if (mapRef.current) {
        mapRef.current.removeLayer(polygon);
      }
      alert("Error calculating impacts. Check that the backend is running.");
      return null;
    });

    if (updatedData) {
      newZone.backendId = updatedData.preset;
      setZones((prev) => [...prev, newZone]);

      if (onEnvironmentUpdate) {
        onEnvironmentUpdate({
          baseline: updatedData.baseline,
          delta: updatedData.delta,
          post_simulation: updatedData.post_simulation,
          preset: updatedData.preset,
          zoneCount: zones.length + 1,
        });
      }
    }
  };

  const cancelDrawing = () => {
    clearTempDrawing();
    setIsDrawing(false);
    setCurrentPoints([]);
    setCurrentZoneType(null);
    if (mapRef.current) {
      mapRef.current.getContainer().style.cursor = "";
    }
  };

  const sendZoneToBackend = async (zone: Zone) => {
    const presetMap: { [key: string]: string } = {
      verde: "green_area",
      residencial: "residential",
      industrial: "industrial",
    };

    if (useMockData) {
      console.log("📤 MOCK mode enabled");
      await new Promise((resolve) => setTimeout(resolve, 500));

      let aqDelta, ndviDelta, tempDelta;

      if (zone.type === "verde") {
        aqDelta = -9.82;
        ndviDelta = 0.546;
        tempDelta = -4.91;
      } else if (zone.type === "industrial") {
        aqDelta = 15.0;
        ndviDelta = -0.2;
        tempDelta = 3.5;
      } else {
        aqDelta = 5.0;
        ndviDelta = -0.05;
        tempDelta = 1.2;
      }

      return {
        baseline: {
          aq_mean_0_100: 73.35,
          ndvi_mean: 0.151,
          temp_c_mean: 47.54,
        },
        delta: {
          aq_mean_0_100: aqDelta,
          ndvi_mean: ndviDelta,
          temp_c_mean: tempDelta,
        },
        post_simulation: {
          aq_mean_0_100: 73.35 + aqDelta,
          ndvi_mean: 0.151 + ndviDelta,
          temp_c_mean: 47.54 + tempDelta,
        },
        preset: presetMap[zone.type],
      };
    }

    const centroid = calculateCentroid(zone.points);

    const payload = {
      preset: presetMap[zone.type],
      latitude: centroid.lat,
      longitude: centroid.lng,
      buffer: buffer,
      geometry: {
        type: "Polygon",
        coordinates: [zone.points.map((p) => [p.lng, p.lat])],
      },
    };

    const response = await fetch("http://localhost:5001/geo/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.payload;
  };

  const calculateCentroid = (
    points: L.LatLng[]
  ): { lat: number; lng: number } => {
    let latSum = 0,
      lngSum = 0;
    points.forEach((point) => {
      latSum += point.lat;
      lngSum += point.lng;
    });
    return { lat: latSum / points.length, lng: lngSum / points.length };
  };

  const clearAllZones = () => {
    if (!window.confirm("Are you sure you want to delete all zones?")) return;
    zones.forEach((zone) => {
      if (mapRef.current) mapRef.current.removeLayer(zone.polygon);
    });
    setZones([]);
    cancelDrawing();
  };

  const calculateGeodesicArea = (latLngs: L.LatLng[]): number => {
    const pointsCount = latLngs.length;
    let area = 0.0;
    const d2r = Math.PI / 180;
    const p1 = latLngs[pointsCount - 1];

    for (let i = 0; i < pointsCount; i++) {
      const p2 = latLngs[i];
      area +=
        d2r *
        (p2.lng - p1.lng) *
        (2 + Math.sin(d2r * p1.lat) + Math.sin(d2r * p2.lat));
    }

    area = (area * 6378137.0 * 6378137.0) / 2.0;
    return Math.abs(area);
  };

  const formatArea = (area: number): string => {
    if (area < 10000) {
      return `${Math.round(area)} m²`;
    } else {
      return `${(area / 10000).toFixed(2)} ha`;
    }
  };

  const activeLayer = activeLayerKey ? layers[activeLayerKey] : null;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl">🗺️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Zone Editor</h3>
                <p className="text-sm text-gray-500">
                  Draw and manage urban areas
                </p>
              </div>
            </div>

            {zones.length > 0 && (
              <button
                onClick={clearAllZones}
                className="px-4 py-2 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all font-medium flex items-center gap-2"
              >
                <span>🗑️</span>
                Clear All
              </button>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            {(Object.keys(zoneConfig) as ZoneType[]).map((type) => (
              <button
                key={type}
                onClick={() => startDrawing(type)}
                disabled={isDrawing && currentZoneType !== type}
                className={`
                  px-5 py-3 rounded-xl font-semibold text-white
                  transition-all duration-200 flex items-center gap-2
                  ${
                    currentZoneType === type
                      ? "scale-105 shadow-xl ring-4 ring-white ring-opacity-50"
                      : "hover:scale-105 hover:shadow-lg"
                  }
                  ${
                    isDrawing && currentZoneType !== type
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                style={{
                  backgroundColor: zoneConfig[type].color,
                  opacity: isDrawing && currentZoneType !== type ? 0.4 : 1,
                }}
              >
                <span className="text-lg">{zoneConfig[type].icon}</span>
                <span>{zoneConfig[type].name}</span>
              </button>
            ))}

            {isDrawing && (
              <button
                onClick={cancelDrawing}
                className="px-5 py-3 rounded-xl font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <span>❌</span>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Control de Capas */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <div className="bg-white p-2 rounded-lg shadow-lg mb-2">
            <p className="text-xs text-gray-600 font-semibold">
              Available Layers: {Object.keys(layers).length}
            </p>
          </div>
          {Object.keys(layers).map((key) => (
            <button
              key={key}
              onClick={() => {
                console.log(`🖱️ Clicked layer: ${key}`);
                setActiveLayerKey(activeLayerKey === key ? null : key);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-lg transition-all ${
                activeLayerKey === key
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {layers[key].legend.title}
            </button>
          ))}
          {Object.keys(layers).length === 0 && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg text-xs max-w-xs">
              <p className="font-bold">⚠️ No Layers</p>
              <p className="mt-1">Check the browser console (F12)</p>
            </div>
          )}
        </div>

        {/* Leyenda */}
        {activeLayer && (
          <div className="absolute bottom-20 right-4 z-[1000] bg-white bg-opacity-95 p-4 rounded-xl shadow-2xl border-2 border-green-200">
            <h3 className="font-bold text-sm mb-3 text-gray-800">
              {activeLayer.legend.title}
            </h3>
            <ul className="space-y-1">
              {activeLayer.legend.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center text-xs text-gray-700"
                >
                  <span
                    className="w-5 h-5 inline-block mr-2 border border-gray-400 rounded"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instrucciones */}
        <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-2xl p-5 max-w-xs backdrop-blur-sm bg-opacity-95 z-[1000]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📍</span>
            <h4 className="text-lg font-bold text-gray-800">Instructions</h4>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex gap-2">
              <span className="font-bold text-indigo-600">1.</span>
              <span>Select a zone type above</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-indigo-600">2.</span>
              <span>Click on the map to add points</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-indigo-600">3.</span>
              <span>
                Press{" "}
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                  Enter
                </kbd>{" "}
                to finish
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-indigo-600">4.</span>
              <span>
                Press{" "}
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                  Esc
                </kbd>{" "}
                to cancel
              </span>
            </div>
          </div>

          {isDrawing && (
            <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-amber-800">
                  Drawing...
                </span>
                <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold">
                  {currentPoints.length} points
                </span>
              </div>
              {currentZoneType && (
                <div className="mt-2 text-xs text-amber-700 flex items-center gap-1">
                  <span>{zoneConfig[currentZoneType].icon}</span>
                  <span>{zoneConfig[currentZoneType].name}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolygonDrawer;
