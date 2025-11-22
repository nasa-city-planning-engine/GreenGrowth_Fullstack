import { getAllCountryNames, getCountryUbi } from "../../../others/apiCountry";
import { useState, useEffect } from "react";
import { useCoordinates } from "../../../others/coordinateProvider";
import { Link } from "react-router-dom";

export default function SelectCoordinates() {
  const { coordinates, setCoordinates: setGlobalCoordinates } =
    useCoordinates();

  const [countries, setCountries] = useState<string[]>([]);
  const [options, setOptions] = useState("");
  const [manualEdit, setManualEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // inputs controlados como texto
  const [latInput, setLatInput] = useState(coordinates.lat.toString());
  const [lngInput, setLngInput] = useState(coordinates.lng.toString());

  // cuando cambian las coordenadas globales (por mover el marcador, por ejemplo)
  useEffect(() => {
    setLatInput(coordinates.lat.toString());
    setLngInput(coordinates.lng.toString());
  }, [coordinates]);

  useEffect(() => {
    getAllCountryNames().then((data) => setCountries(data));
  }, []);

  useEffect(() => {
    if (options && !manualEdit) {
      getCountryUbi(options).then((coords) => {
        if (coords) {
          setGlobalCoordinates(coords);
        } else {
          console.error("No se encontraron coordenadas");
        }
      });
    }
  }, [options, manualEdit, setGlobalCoordinates]);

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLatInput(value);

    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setGlobalCoordinates({ ...coordinates, lat: parsed });
      setManualEdit(true);
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLngInput(value);

    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setGlobalCoordinates({ ...coordinates, lng: parsed });
      setManualEdit(true);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions(e.target.value);
    setManualEdit(false);
  };

  const filteredCountries = countries.filter((country) =>
    country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute top-4 right-10 z-[1000] bg-white bg-opacity-95 p-3 rounded-lg shadow-lg border border-green-200 w-72 space-y-3">
      {/* Búsqueda y selección */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Search Country
        </label>
        <input
          type="text"
          placeholder="Type to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-gray-900 bg-white rounded-md border border-gray-300 focus:border-green-500 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Country
        </label>
        <select
          onChange={handleCountryChange}
          value={options}
          className="w-full px-3 py-2 text-gray-900 bg-white rounded-md border border-gray-300 focus:border-green-500 focus:outline-none text-sm"
        >
          <option value="">Choose Country</option>
          {filteredCountries.map((country, index) => (
            <option key={index}>{country}</option>
          ))}
        </select>
        <p className="text-[10px] text-gray-500 mt-1">
          Showing {filteredCountries.length} of {countries.length}
        </p>
      </div>

      {/* Coordenadas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Modify Coordinates
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Lat
            </label>
            <input
              type="number"
              step="0.0001"
              min={-90}
              max={90}
              value={latInput}
              onChange={handleLatChange}
              className="w-full px-2 py-1 text-gray-900 bg-white rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
            />
            {parseFloat(latInput) > 90 || parseFloat(latInput) < -90 ? (
              <p className="text-[10px] text-red-600 mt-0.5">
                Between -90 and 90
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Lng
            </label>
            <input
              type="number"
              step="0.0001"
              min={-180}
              max={180}
              value={lngInput}
              onChange={handleLngChange}
              className="w-full px-2 py-1 text-gray-900 bg-white rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 py-2 content-end">
        <Link
          to="/edit"
          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors text-center"
        >
          Make Simulation
        </Link>
        <Link
          to="/reportList"
          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors text-center"
        >
          Check Report List
        </Link>
      </div>
    </div>
  );
}
