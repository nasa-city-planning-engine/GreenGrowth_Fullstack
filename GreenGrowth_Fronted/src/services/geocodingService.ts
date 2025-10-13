// Servicio para detectar ciudades desde coordenadas GPS usando OpenStreetMap Nominatim

interface GeocodingResult {
  city: string;
  country: string;
  state?: string;
  fullAddress: string;
}

// Cache para evitar llamadas repetidas a la API
const cityCache: { [key: string]: GeocodingResult } = {};

/**
 * Obtiene la ciudad y país desde coordenadas GPS
 * @param lat Latitud
 * @param lng Longitud
 * @returns Objeto con ciudad, país y dirección completa
 */
export const getCityFromCoordinates = async (
  lat: number, 
  lng: number
): Promise<GeocodingResult> => {
  // Revisar cache primero
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  
  if (cityCache[cacheKey]) {
    console.log('✅ Ciudad obtenida del cache:', cityCache[cacheKey].city);
    return cityCache[cacheKey];
  }

  try {
    // Llamada a la API de Nominatim (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GreenGrowth/1.0' // Requerido por Nominatim
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Extraer información de ubicación con fallbacks
    const city = data.address.city || 
                 data.address.town || 
                 data.address.village || 
                 data.address.municipality || 
                 data.address.county ||
                 data.address.state ||
                 'Ubicación desconocida';
    
    const country = data.address.country || 'País desconocido';
    const state = data.address.state || data.address.province || '';
    const fullAddress = data.display_name || '';

    const result: GeocodingResult = {
      city,
      country,
      state,
      fullAddress
    };

    // Guardar en cache
    cityCache[cacheKey] = result;
    
    console.log('🌍 Ciudad detectada:', city, country);
    
    return result;
  } catch (error) {
    console.error('❌ Error en geocoding:', error);
    return {
      city: 'Ubicación desconocida',
      country: '',
      fullAddress: ''
    };
  }
};

/**
 * Procesa múltiples coordenadas con rate limiting
 * @param coordinates Array de objetos con lat y lng
 * @param delayMs Delay entre llamadas en milisegundos (mínimo 100ms)
 * @returns Array con resultados de geocoding
 */
export const batchGeocode = async (
  coordinates: Array<{ lat: number; lng: number }>,
  delayMs: number = 150
): Promise<GeocodingResult[]> => {
  const results: GeocodingResult[] = [];
  
  for (const coord of coordinates) {
    const result = await getCityFromCoordinates(coord.lat, coord.lng);
    results.push(result);
    
    // Respetar rate limits de Nominatim (máximo 1 request/segundo)
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  return results;
};

/**
 * Limpia el cache de geocoding
 */
export const clearGeocodingCache = () => {
  Object.keys(cityCache).forEach(key => delete cityCache[key]);
  console.log('🗑️ Cache de geocoding limpiado');
};

// Ejemplo de uso en tu componente:
/*
import { getCityFromCoordinates, batchGeocode } from './geocodingService';

// Para una sola denuncia:
const { city, country } = await getCityFromCoordinates(29.0729, -110.9559);
console.log(`Ciudad: ${city}, País: ${country}`); // Ciudad: Hermosillo, País: México

// Para múltiples denuncias (con rate limiting automático):
const denuncias = [
  { lat: 29.0729, lng: -110.9559 },
  { lat: 19.4326, lng: -99.1332 },
  { lat: 40.7128, lng: -74.0060 }
];

const ciudades = await batchGeocode(denuncias);
// Resultado: [
//   { city: 'Hermosillo', country: 'México', ... },
//   { city: 'Ciudad de México', country: 'México', ... },
//   { city: 'New York', country: 'United States', ... }
// ]
*/