//Conexion a backend src/others/apiBack.ts

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

export interface FetchLayerParams {
  lat: number;
  lng: number;
  buffer?: number;
}

export async function fetchLayerData(
  key: "temp" | "aq" | "ndvi",
  { lat, lng, buffer = 50000 }: FetchLayerParams
) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    buffer: buffer.toString(),
  });

  const url = `${BACKEND_API}/geo/get-initial-data/${key}?${params.toString()}`;
  console.log(`📡 Requesting layer: ${key}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  console.log(`✅ Response for ${key}:`, data);
  return data;
}

/**
 * Función que obtiene todas las capas ambientales disponibles.
 * Devuelve un objeto con key → payload válido.
 */
export async function fetchAllEnvironmentalLayers(
  lat: number,
  lng: number,
  buffer = 50000
) {
  const layerKeys: ("temp" | "aq" | "ndvi")[] = ["temp", "aq", "ndvi"];

  const results = await Promise.allSettled(
    layerKeys.map((key) => fetchLayerData(key, { lat, lng, buffer }))
  );

  const validLayers: Record<string, any> = {};

  results.forEach((result, index) => {
    const key = layerKeys[index];
    if (result.status === "fulfilled" && result.value?.payload?.url) {
      validLayers[key] = result.value.payload;
    } else {
      console.warn(`⚠️ Layer ${key} could not be loaded`, result);
    }
  });

  return validLayers;
}

export async function fetchInitialKPIs(
  name: string,
  lat: number,
  lng: number,
  buffer: number
) {
  const url = `${BACKEND_API}/geo/get-kpis/${name}?latitude=${lat}&longitude=${lng}&buffer=${buffer}`;
  console.log(`Requesting KPI for ${name}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  return data.payload;
}

// To be configured
export async function sendPolygonSim(body: Object) {
  const url = `${BACKEND_API}/geo/simulate-polygons`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.payload;
    
  } catch (error) {
    console.error("Error sending polygon simulation:", error);
    throw error;
  }
}
