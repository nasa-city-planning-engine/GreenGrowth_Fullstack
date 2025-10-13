import { useEffect } from "react";
import { useCoordinates } from "../others/coordinateProvider";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { DraggableMarker } from "./draggableMarker";

interface BaseMapProps {
  children?: React.ReactNode;
  zoomProp?: number;
}

export default function BaseMap({ children, zoomProp = 7 }: BaseMapProps) {
  const { coordinates } = useCoordinates();
  const position: [number, number] = [coordinates.lat, coordinates.lng];

  function ChangeMapView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  }

  return (
    <MapContainer center={position} zoom={zoomProp} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeMapView center={position} />
      <DraggableMarker />

      {children}
    </MapContainer>
  );
}
