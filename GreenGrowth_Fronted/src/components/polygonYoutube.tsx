import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useState } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { LatLng } from "leaflet";

interface MapVector {
  id: number;
  latLngs: LatLng[];
}

//Ocupo adaptarlo a que sea Area Verde, Industria, etc. y que lo mande al Back

export default function PolygonMaker() {
  const [mapLayers, setMapLayers] = useState<MapVector[]>([]);

  const _onCreate = (e: any) => {
    console.log(e);
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latLngs: layer.getLatLngs()[0] },
      ]);
    }
  };

  const _onEdited = (e: any) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).forEach((layer: any) => {
      const { _leaflet_id } = layer;
      setMapLayers((prevLayers) =>
        prevLayers.map((l) =>
          l.id === _leaflet_id ? { ...l, latLngs: layer.getLatLngs()[0] } : l
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
                color: "#16a34a", 
                fillColor: "#16a34a", 
                fillOpacity: 0.4, 
                weight: 4, 
              },
            },
          }}
        />
      </FeatureGroup>
    </>
  );
}
