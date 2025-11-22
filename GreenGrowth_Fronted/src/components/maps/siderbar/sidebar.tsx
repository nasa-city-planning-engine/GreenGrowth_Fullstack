import { Link } from "react-router-dom";
import FormParameters from "./FormParameters";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCoordinates } from "../../../others/coordinateProvider";
import { useZone } from "../../../others/simulationProvider";
import { zoneConfig } from "../../../types/consts";

interface SideBarProps {
  handleClick: () => void;
}

export default function Sidebar({handleClick} :SideBarProps) {
  const { coordinates } = useCoordinates();
  const { zone, setZone } = useZone();

  return (
    <>
      <aside className="h-full flex flex-col bg-orange-100 border-r border-red-300/85 shadow-md overflow-y-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Link
            to="/map"
            className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Choose Location
          </Link>
        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4">
          <p className="font-semibold text-gray-800 justify-self-center">
            Instructions
          </p>
          <ol className="list-decimal ml-5 text-sm text-gray-600 ">
            <li>Find the place you wish to modify</li>
            <li>Explore environmental layers</li>
            <li>Select a zone to configure parameters</li>
            <li>Draw polygon with the tools (top right)</li>
            <li>Send Polygon</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg p-3 border border-blue-200  justify-items-center">
          <p className="text-s mb-2 font-semibold text-gray-800">
            {" "}
            You are here:{" "}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Latitude:
              </label>
              <p>{coordinates.lat.toFixed(3)}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Longitude:
              </label>
              <p>{coordinates.lng.toFixed(3)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {Object.values(zoneConfig).map((z) => (
            <button
              key={z.key}
              onClick={() => setZone({ zone: z.key })}
              // Using stye to avoid conflict with Tailwind
              style={{
                backgroundColor: zone.zone === z.key ? z.color : undefined,
                color: zone.zone === z.key ? "white" : undefined,
              }}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-semibold transition ${
                zone.zone === z.key
                  ? "border-transparent shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <span>{z.icon}</span>
              {z.name}
            </button>
          ))}
        </div>

        {zone.zone && <FormParameters type={zone.zone} />}
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white z-[999] w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-semibold transition" onClick={handleClick}>
          Run Simulation
          {/* <CornerRightUp></CornerRightUp> */}
        </button>

        <div className="justify-items-end py-2">
          <Link
            to="/report"
            className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold"
          >
            Make a Report
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
