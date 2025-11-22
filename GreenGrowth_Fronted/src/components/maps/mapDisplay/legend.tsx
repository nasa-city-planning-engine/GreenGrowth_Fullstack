import React from "react";
import type { LayerData } from "../../../types/types";

interface LegendProps {
  activeLayer: LayerData | null;
}

const Legend: React.FC<LegendProps> = ({ activeLayer }) => {
  if (!activeLayer) return null;

  return (
    <div className="absolute bottom-10 right-4 z-[1000] bg-white bg-opacity-95 p-4 rounded-xl shadow-2xl border-2 border-green-200">
      <h3 className="font-bold text-sm mb-3 text-gray-800">
        {activeLayer.legend.title}
      </h3>
      <ul className="space-y-1">
        {activeLayer.legend.items.map((item : any, index) => (
          <li
            key={index}
            className="flex items-center text-xs text-gray-700"
          >
            <span
              className="w-5 h-5 inline-block mr-2 border border-gray-400 rounded"
              style={{ backgroundColor: item.color }}
            ></span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;