import SelectCoordinates from "../components/UbiForm";
import BaseMap from "../components/baseMap";

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
