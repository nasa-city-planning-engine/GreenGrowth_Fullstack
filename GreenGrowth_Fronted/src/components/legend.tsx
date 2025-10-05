// src/components/LegendMap.tsx

import React from "react"

/**
 * Defines the structure for a single item in the legend.
 * @property {string} color - The CSS color string (e.g., '#FF0000', 'rgba(255, 0, 0, 0.5)').
 * @property {string} label - The text description for this color.
 */
interface LegendItem {
  color: string
  label: string
}

/**
 * Defines the props for the LegendMap component.
 * @property {string} title - The title to be displayed at the top of the legend.
 * @property {LegendItem[]} items - An array of legend items to display.
 */
interface LegendMapProps {
  title: string
  items: LegendItem[]
}

const LegendMap: React.FC<LegendMapProps> = ({ title, items }) => {
  // Return null if there are no items to prevent rendering an empty box.
  if (!items || items.length === 0) {
    return null
  }

  return (
    // This container uses absolute positioning to float over the map.
    // Ensure its parent container has a `position: relative` style.
    // z-index is set high to ensure it's on top of map layers.
    <div className="absolute bottom-5 right-5 z-[1000] bg-white bg-opacity-90 p-3 rounded-md shadow-lg w-auto border border-green-200">
      <h3 className="font-bold text-sm mb-2 text-gray-800">{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center text-xs text-gray-700 mb-1 "
          >
            {/* The color swatch */}
            <span
              className="w-4 h-4 inline-block mr-2 border border-gray-400"
              style={{ backgroundColor: item.color }}
            ></span>
            {/* The label */}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LegendMap