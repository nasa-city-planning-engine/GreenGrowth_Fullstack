import BaseMap from "../components/baseMap";
import EnvironmentalLayers from "../components/environmentalLayers";
import PolygonMaker from "../components/polygonYoutube";
import Sidebar from "../components/sidebar";
import SimulationResults from "../components/SimulationResults";

const EditPage = () => {

return (
    <div className="flex h-screen">
      <div className="basis-1/7">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 h-full"> 
          <BaseMap zoomProp={10}>
            <EnvironmentalLayers />
            <PolygonMaker />
          </BaseMap>
        </div>
        <SimulationResults />
        
      </div>
    </div>
  );
};

export default EditPage;