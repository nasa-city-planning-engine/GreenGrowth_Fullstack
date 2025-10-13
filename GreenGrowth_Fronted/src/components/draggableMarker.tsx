import { useMemo, useRef } from "react";
import { useCoordinates } from "../others/coordinateProvider";
import { Marker, Popup } from "react-leaflet";
import type L from "leaflet";

export function DraggableMarker() {
  const { coordinates, setCoordinates: setGlobalCoordinates } = useCoordinates();
  const position: [number, number] = [coordinates.lat, coordinates.lng];

  const markerRef = useRef<L.Marker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          setGlobalCoordinates(marker.getLatLng());
        }
      },
    }),
    [setGlobalCoordinates]
  );

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span>
          <p className="font-bold">Coordinates</p>
          <p>Latitude: {position[0].toFixed(3)}</p>
          <p>Longitude: {position[1].toFixed(3)}</p>
        </span>
      </Popup>
    </Marker>
  );
}