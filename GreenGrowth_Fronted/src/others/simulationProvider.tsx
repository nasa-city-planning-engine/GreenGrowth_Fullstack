import { createContext, useContext, useState } from "react";

interface SimProviderProps{
  children: React.ReactNode;
}

interface FormParameters{
  [key: string]:  any | any[];
}

export interface Polygons {
  polygons: Array<{
    id: number;
    latLngs: { lat: number; lng: number }[];
    params: any;
    zoneType:string;
  }>;
}

interface Zone{
  zone:"green zone" | "residential zone" | "industrial zone" ;
}

// Definición de los Contextos
interface FormParametersContext{
  formParameters: FormParameters;
  setFormParameters: (value: FormParameters) => void;
}

interface PolygonsContext{
  polygons: Polygons;
  setPolygons: (value: Polygons) => void;
}

interface ZoneContext{
  zone: Zone;
  setZone: (value: Zone) => void;
}

//Concorde a ts
interface FormParametersContextType{
  formParameters: FormParameters;
  setFormParameters: (value: FormParameters) => void;
}

interface PolygonsContextType{
  polygons: Polygons;
  setPolygons: (value: Polygons) => void;
}

interface ZoneContextType{
  zone: Zone;
  setZone: (value: Zone) => void;
}

// Valores por defecto
export const FormParametersContext = createContext<FormParametersContextType>({
  formParameters: {},
  setFormParameters: ()=> {},
});

export const PolygonsContext = createContext<PolygonsContextType>({
  polygons: { polygons: [] },
  setPolygons: ()=>{},
})

export const ZoneContext = createContext<ZoneContextType>({
  // "industrial" | "green_real" | "residential_real";
  zone: {zone: "green zone"},
  setZone: () => {},
})

// Funciones para modificar los valores de contexto Providers

export function FormParametersProvider({children}: SimProviderProps){
  const [formParameters,setFormParameters] =
  useState<FormParameters>({});

  return (
    <FormParametersContext.Provider value={{formParameters,setFormParameters}}>
        {children}
    </FormParametersContext.Provider>

  )
}


export function PolygonsProvider({children}: SimProviderProps){
  const [polygons,setPolygons] =
  useState<Polygons>({polygons: []});
  return (
    <PolygonsContext.Provider value={{polygons,setPolygons}}>
        {children}
    </PolygonsContext.Provider>

  )
}

export function ZoneProvider({children}: SimProviderProps){
  const [zone,setZone] =
  useState<Zone>({zone:"green zone"});
  return (
    <ZoneContext.Provider value={{zone,setZone}}>
        {children}
    </ZoneContext.Provider>

  )
}

// Para que pueda utilizarse
export const usePolygons = () => useContext(PolygonsContext);
export const useFormParameters = () => useContext(FormParametersContext);
export const useZone = () => useContext(ZoneContext);

