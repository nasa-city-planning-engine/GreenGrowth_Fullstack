import { createContext, useContext, useState } from "react";

interface Zone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number }[];
}

interface PolygonContextType {
  zones: Zone[];
  setZones: (zones: Zone[]) => void;
}

const PolygonContext = createContext<PolygonContextType>({
  zones: [],
  setZones: () => {},
});

export const PolygonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<Zone[]>([]);

  return (
    <PolygonContext.Provider value={{ zones, setZones }}>
      {children}
    </PolygonContext.Provider>
  );
};

export const usePolygons = () => useContext(PolygonContext);