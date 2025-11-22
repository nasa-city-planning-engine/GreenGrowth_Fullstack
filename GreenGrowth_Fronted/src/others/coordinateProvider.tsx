import { useContext, createContext, useState} from "react";

interface AuthProviderProps{
    children: React.ReactNode;
}

export interface Coords{
    lat: number;
    lng: number;
}

interface CoordinatesContext{
    coordinates: Coords;
    setCoordinates: (value: Coords) => void;
}

interface CoordinatesContextType {
    coordinates: Coords;
    setCoordinates: (value: Coords) => void;
}

export const CoordinatesContext = createContext<CoordinatesContextType>({
    coordinates: { lat: 29.0729, lng: -110.9559 }, // Valores por defecto (Hermosillo)
    setCoordinates: () => {},
});

export function CoordinatesProvider({ children }: AuthProviderProps) {
    const [coordinates, setCoordinates] = useState<Coords>({ 
        lat: 29.0729, 
        lng: -110.9559 
    });

    return (
        <CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>
            {children}
        </CoordinatesContext.Provider>
    );
}

export const useCoordinates = () => useContext(CoordinatesContext);