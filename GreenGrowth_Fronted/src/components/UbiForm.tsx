import { getAllCountryNames, getCountryUbi } from "../apiCountry";
import { useState, useEffect } from "react";
import { useCoordinates } from "../coordinateProvider"; // Cambio aquí

export default function SelectCoordinates() {
  // Obtener la función del contexto
  const { setCoordinates: setGlobalCoordinates } = useCoordinates();

  const [countries, setCountries] = useState<string[]>([]);
  const [options, setOptions] = useState("");
  const [coordinates, setLocalCoordinates] = useState({ lat: 0, lng: 0 }); // Renombrado
  const [manualEdit, setManualEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllCountryNames().then((data) => setCountries(data));
  }, []);

  useEffect(() => {
    if (options && !manualEdit) {
      getCountryUbi(options).then((coords) => {
        if (coords) {
          setLocalCoordinates(coords);
          setGlobalCoordinates(coords); // Actualizar contexto global
        } else {
          console.error("No se encontraron coordenadas");
        }
      });
    }
  }, [options, manualEdit]);

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLat = parseFloat(e.target.value) || 0;
    const newCoords = { ...coordinates, lat: newLat };
    setLocalCoordinates(newCoords);
    setGlobalCoordinates(newCoords); // Actualizar contexto global
    setManualEdit(true);
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLng = parseFloat(e.target.value) || 0;
    const newCoords = { ...coordinates, lng: newLng };
    setLocalCoordinates(newCoords);
    setGlobalCoordinates(newCoords); // Actualizar contexto global
    setManualEdit(true);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions(e.target.value);
    setManualEdit(false);
  };

  const filteredCountries = countries.filter((country) => {
    return country && country.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            {/* Búsqueda y selección de país en la misma fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Country
                </label>
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-white rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  onChange={handleCountryChange}
                  value={options}
                  className="w-full px-4 py-3 text-gray-900 bg-white rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none transition-colors"
                >
                  <option value="">Choose Country</option>
                  {filteredCountries.map((opts, index) => (
                    <option key={index}>{opts}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Showing {filteredCountries.length} of {countries.length}{" "}
                  countries
                </p>
              </div>
            </div>

            {/* Coordenadas del país */}
            {options && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900">
                  Selected Country Coordinates:
                </p>
                <p className="text-sm text-green-800 mt-1">
                  Latitude: {coordinates.lat} | Longitude: {coordinates.lng}
                </p>
              </div>
            )}

            {/* Modificar coordenadas manualmente */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Modify Coordinates Manually
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={coordinates.lat}
                    onChange={handleLatChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="e.g. 19.4326"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={coordinates.lng}
                    onChange={handleLngChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="e.g. -99.1332"
                  />
                </div>
              </div>
            </div>

            {/* Coordenadas actuales */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900">
                📍 Current Coordinates
              </p>
              <p className="text-lg font-bold text-blue-800 mt-2">
                Latitude: {coordinates.lat}, Longitude: {coordinates.lng}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
