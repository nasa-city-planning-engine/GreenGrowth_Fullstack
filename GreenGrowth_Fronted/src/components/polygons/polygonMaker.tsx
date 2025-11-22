import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useState, useEffect } from "react";
import { FeatureGroup, Polygon, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { LatLng } from "leaflet";
import {
  useFormParameters,
  usePolygons,
  useZone,
} from "../../others/simulationProvider";
import { parameterForm } from "../../types/consts";

interface MapVector {
  id: number;
  // zoneType:string;
  latLngs: LatLng[];
  params?: any;
  zoneType: "residential zone" | "industrial zone" | "green zone";
  //Type, creo que lo sacare de un  contexto a partir de los botones en sidebar + quiero que el poligono cambie de color con type y de params que acepte
}

export default function PolygonMaker() {
  const { setPolygons } = usePolygons();
  const { formParameters } = useFormParameters();
  const { zone } = useZone();

  const getZoneColor = (
    zoneName: "residential zone" | "industrial zone" | "green zone"
  ) => {
    return parameterForm[zoneName]?.color || "#16a34a";
  };

  const [mapLayers, setMapLayers] = useState<MapVector[]>([]);

  useEffect(() => {
    const polygons = mapLayers.map((layer) => ({
      id: layer.id,
      latLngs: layer.latLngs.map((p) => ({ lat: p.lat, lng: p.lng })),
      params: layer.params,
      zoneType: layer.zoneType,
    }));

    setPolygons({ polygons });
  }, [mapLayers]);

  function filterParamsForZone(
    zoneType: "residential zone" | "industrial zone" | "green zone",
    formParameters: any
  ) {
    const allowedKeys = parameterForm[zoneType].parameters.map((p) => p.key);

    const filtered: any = {};
    for (const key of allowedKeys) {
      if (formParameters[key] !== undefined) {
        filtered[key] = formParameters[key];
      }
    }
    return filtered;
  }

  const _onCreate = (e: any) => {
    console.log(e);
    const { layerType, layer } = e;

    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      const filteredParams = filterParamsForZone(zone.zone, formParameters);
      console.log(zone.zone);
      console.log(filteredParams);

      setMapLayers((layers) => [
        ...layers,
        {
          id: _leaflet_id,
          latLngs: layer.getLatLngs()[0],
          params: filteredParams,
          zoneType: zone.zone,
        },
      ]);
    }
  };

  const _onEdited = (e: any) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).forEach((layer: any) => {
      const { _leaflet_id } = layer;
      layer.setStyle({
        color: getZoneColor(zone.zone),
        fillColor: getZoneColor(zone.zone),
        fillOpacity: 0.4,
        weight: 4,
      });
      setMapLayers((prevLayers) =>
        prevLayers.map((l) =>
          l.id === _leaflet_id
            ? {
                ...l,
                latLngs: layer.getLatLngs()[0],
              }
            : l
        )
      );
    });
  };

  const _onDeleted = (e: any) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).forEach((layer: any) => {
      const { _leaflet_id } = layer;
      setMapLayers((prevLayers) =>
        prevLayers.filter((l) => l.id !== _leaflet_id)
      );
    });
    console.log(mapLayers);
  };

  const formatValue = (value: any): string => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value);
  };

  return (
    <>
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={_onCreate}
          onDeleted={_onDeleted}
          onEdited={_onEdited}
          draw={{
            rectangle: false,
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polygon: {
              allowIntersection: true,
              showArea: true,
              shapeOptions: {
                color: getZoneColor(zone.zone),
                fillColor: getZoneColor(zone.zone),
                fillOpacity: 0.4,
                weight: 4,
              },
            },
          }}
        />
        {mapLayers.map((layer) => (
          <Polygon
            key={layer.id}
            positions={layer.latLngs}
            pathOptions={{
              color: getZoneColor(layer.zoneType),
              fillColor: getZoneColor(layer.zoneType),
              fillOpacity: 0.4,
              weight: 4,
            }}
          >
            {/* Posiblemente considerar qr porque los parametros nacen naturalmente vacios
            ademas ocupo checar errores al mandar a back*/}
            <Popup minWidth={120}>
              {layer.params ? (
                <div>
                  <div>
                    <strong>Zone:</strong> {layer.zoneType.toUpperCase()}
                  </div>
                  {Object.entries(layer.params).map(([key, value]) => {
                    const paramConfig = parameterForm[
                      layer.zoneType
                    ].parameters.find((p) => p.key === key);
                    const displayName = paramConfig?.name || key.toUpperCase();

                    return (
                      <div key={key}>
                        <strong>{displayName}:</strong> {formatValue(value)}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No parameters found</p>
              )}
            </Popup>
          </Polygon>
        ))}
      </FeatureGroup>
    </>
  );
}
