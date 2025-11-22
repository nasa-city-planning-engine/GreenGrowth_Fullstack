import { useState, useEffect } from "react";
import { ChevronDown, Thermometer, Leaf, Wind } from "lucide-react";
import { KPICard } from "../../ui/KPICard";
import type { KPIData } from "../../../types/types";


interface SimulationResultsProps {
  currentData: KPIData;
  simulatedData: KPIData;
}

const SimulationResults = ({ currentData, simulatedData }: SimulationResultsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    console.log("Current results updated:", currentData);
  }, [currentData]);

  
  useEffect(() => {
    console.log("Simulations results updated:", simulatedData);
  }, [simulatedData]);

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      {/* Header Section, Toggle Expansion*/}
      <div
        className="bg-lime-100/50 hover:bg-lime-100 transition-colors duration-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between p-4 px-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Simulation Results
          </h2>
          <button
            className={`text-gray-700 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Data Container */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Current Data
            </h3>
            <div className="grid grid-cols-3 gap-4 auto-rows-max">
                <KPICard
                  title="Avg. Surface Temperature"
                  value={
                    currentData.temp ? currentData.temp.toFixed(2) + " °C" : "—"
                  }
                  icon={<Thermometer size={24} />}
                  colorClass="text-orange-600"
                  iconBgClass="bg-orange-100"
                />
                <KPICard
                  title="Vegetation Index (NDVI)"
                  value={currentData.NDVI ? currentData.NDVI.toFixed(3) : "—"}
                  icon={<Leaf size={24} />}
                  colorClass="text-green-600"
                  iconBgClass="bg-green-100"
                />
                <KPICard
                  title="Air Quality Index (AQI)"
                  value={currentData.AQ ? currentData.AQ.toFixed(2) : "—"}
                  icon={<Wind size={24} />}
                  colorClass="text-blue-600"
                  iconBgClass="bg-blue-100"
                />
            </div>
          </div>

          {/* Projected Data Container */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Projected Data
            </h3>
            <div className="grid grid-cols-3 gap-4 auto-rows-max">
                <KPICard
                  title="Avg. Surface Temperature"
                  value={simulatedData.temp ? simulatedData.temp.toFixed(2) + " °C" : "—"}
                  subtitle={`Changed: ${(simulatedData.temp ?? 0) - (currentData.temp ?? 0)}`}
                  icon={<Thermometer size={24} />}
                  colorClass="text-orange-600"
                  iconBgClass="bg-orange-100"
                />
                <KPICard
                  title="Vegetation Index (NDVI)"
                  value={simulatedData.NDVI ? simulatedData.NDVI.toFixed(3) : "—"}
                  subtitle={`Changed: ${(simulatedData.NDVI ?? 0) - (currentData.NDVI ?? 0)}`}
                  icon={<Leaf size={24} />}
                  colorClass="text-green-600"
                  iconBgClass="bg-green-100"
                />
                <KPICard
                  title="Air Quality Index (AQI)"
                  value={simulatedData.AQ ? simulatedData.AQ.toFixed(2) + " °C" : "—"}
                  subtitle={`Chanfed: ${(simulatedData.AQ ?? 0) - (currentData.AQ ?? 0)}`}
                  icon={<Wind size={24} />}
                  colorClass="text-blue-600"
                  iconBgClass="bg-blue-100"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;