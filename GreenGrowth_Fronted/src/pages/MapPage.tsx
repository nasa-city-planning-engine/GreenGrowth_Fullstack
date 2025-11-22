import SelectCoordinates from "../components/maps/siderbar/UbiForm";
import BaseMap from "../components/maps/mapDisplay/baseMap";

const MapPage = () => {
  return (
    <>
      <div className="relative w-full h-screen">
        <BaseMap zoomProp={7}></BaseMap>
        <SelectCoordinates></SelectCoordinates>
      </div>
    </>
  );
};

export default MapPage;
