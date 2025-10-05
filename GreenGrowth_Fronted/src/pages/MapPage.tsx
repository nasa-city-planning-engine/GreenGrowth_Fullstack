import { Link } from "react-router-dom";
import MapView from "../components/mapView";
import SelectCoordinates from "../components/UbiForm";

const MapPage = () => {
  return (
    <>
      <SelectCoordinates />
      <MapView></MapView>
      <div className="flex justify-center py-6" style={{ backgroundColor: "#EEF8FC" }}>
        <Link
          to="/edit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-12 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
        >
          Next
        </Link>
      </div>
    </>
  );
};

export default MapPage;
