import BaseMap from "../components/maps/mapDisplay/baseMap";
import EnvironmentalLayers from "../components/maps/mapDisplay/environmentalLayers";
import PolygonMaker from "../components/polygons/polygonMaker";
import Sidebar from "../components/maps/siderbar/sidebar";
import SimulationResults from "../components/maps/results/SimulationResults";

import { fetchInitialKPIs } from "../others/apiBack";
import { useCoordinates } from "../others/coordinateProvider";
import { usePolygons } from "../others/simulationProvider";
import { useState, useEffect } from "react";

import type { KPIData, ZoneType } from "../types/types";
import { sendPolygonSim } from "../others/apiBack";

const EditPage = () => {
  const { coordinates } = useCoordinates();
  const { polygons } = usePolygons();
  const [currentData, setCurrentData] = useState<KPIData>({
    temp: null,
    AQ: null,
    NDVI: null,
  });
  const [simData, setSimData] = useState<KPIData>({
    temp: null,
    AQ: null,
    NDVI: null,
  });

  const getKPIs = async () => {
    try {
      const heat = await fetchInitialKPIs(
        "heat",
        coordinates.lat,
        coordinates.lng,
        5000
      );
      const ndvi = await fetchInitialKPIs(
        "NDVI",
        coordinates.lat,
        coordinates.lng,
        5000
      );
      const aq = await fetchInitialKPIs(
        "AQ",
        coordinates.lat,
        coordinates.lng,
        5000
      );

      const data: KPIData = {
        temp: heat.avg_surface_temp,
        AQ: aq.avg_air_quality,
        NDVI: ndvi.avg_NVDI,
      };

      setCurrentData(data);
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    }
  };

  useEffect(() => {
    getKPIs();
  }, [coordinates.lat, coordinates.lng]);

  const sendPolygons = async () => {
    try {
      const json = buildSimulationJSON(5000);
      const res = await sendPolygonSim(json);
      const simKPI = res.global_kpis;
      const maps = res.map_urls;

      const data: KPIData = {
        temp: simKPI.avg_surface_temp_sim,
        AQ: simKPI.avg_AQ_sim,
        NDVI: simKPI.avg_NVDI_sim,
      };

      setSimData(data);

      return maps;
    } catch (e) {
      console.error("Error fetching simulation:", e);
    }
  };

  function buildSimulationJSON(buff: number) {
    //Más fácil acceder al arreglo de objetos poligonos dentro del contexto
    const arrayP = polygons.polygons;

    // 1. Mapeo de presets por tipo de zona
    const presetMap: Record<ZoneType, string> = {
      "industrial zone": "industrial",
      "residential zone": "residential_real",
      "green zone": "green_real",
    };

    // Construcción de geometries[]
    const geometries = arrayP.map((poly) => {

      const coords = poly.latLngs.map((l) => {
        if (!l.lat || !l.lng)
          throw new Error("Polygon has invalid lat/lng values");
        return [l.lng, l.lat];
      });

      // Cerrar polígono si no está cerrado (GEOjSON COSAS)
      const first = coords[0];
      const last = coords[coords.length - 1];

      if (first[0] !== last[0] || first[1] !== last[1]) {
        coords.push([...first]); // agrega copia del primero
      }

      return {
        type: "Feature",
        properties: {
          preset: presetMap[poly.zoneType as ZoneType],
          ...poly.params, // parámetros dinámicos según zona
        },
        geometry: {
          type: "Polygon",
          coordinates: [coords],
        },
      };
    });

    // JSON final
    return {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      buffer: buff,
      geometries,
    };
  }

  //eL BOTÓN SE VE DEL CULO PERO FUNCIONA
  //oCUPO CAMBIAR INSTRUCCIONES Y SUBTITULOS
  //mENSAJE EN CONSOLA
  //MAPA
  //OCUPO PROBARLO MEJOR PERO RAAA

  return (
    <div className="flex h-screen">
      <div className="basis-1/7">
        <Sidebar handleClick={sendPolygons} />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 h-full">
          <BaseMap zoomProp={10}>
            <EnvironmentalLayers />
            <PolygonMaker />
          </BaseMap>
        </div>
        <SimulationResults currentData={currentData} simulatedData={simData} />
      </div>
    </div>
  );
};

export default EditPage;
