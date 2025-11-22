
export const zoneConfig = {
  verde: { key:"green zone", color: "#10b981", name: "Green Zone", icon: "🌳" },
  residencial: { key:"residential zone",color: "#f59e0b", name: "Residential Zone", icon: "🏘️" },
  industrial: { key:"industrial zone",color: "#6366f1", name: "Industrial Zone", icon: "🏭" },
} as const;

export const legendData = {
  temp: {
    title: "Temperature (°C)",
    items: [
      { color: "#8B0000", label: "> 40" },
      { color: "#FF4500", label: "30 - 40" },
      { color: "#FFD700", label: "20 - 30" },
      { color: "#00BFFF", label: "10 - 20" },
      { color: "#00008B", label: "< 10" },
    ],
  },
  aq: {
    title: "Air Quality (AQI)",
    items: [
      { color: "#009966", label: "Good (0-50)" },
      { color: "#FFDE33", label: "Moderate (51-100)" },
      { color: "#FF9933", label: "Unhealthy for Sensitive Groups (101-150)" },
      { color: "#CC0033", label: "Very Unhealthy (151-200)" },
      { color: "#660099", label: "Hazardous (201+)" },
    ],
  },
  ndvi: {
    title: "Vegetation Index (NDVI)",
    items: [
      { color: "#2d9c43", label: "High Vegetation" },
      { color: "#9cdb5f", label: "Moderate Vegetation" },
      { color: "#f9dd63", label: "Low Vegetation" },
      { color: "#d1a065", label: "Bare Soil" },
      { color: "#f2f2f2", label: "No Data / Clouds" },
    ],
  },
};



export const parameterForm = {
  "residential zone": {
    color: "#F59E0B",
    parameters: [
      { key:"densidad",
         name: "Building Density (buildings/km^2)", type: "slider", range: [0, 100] },
      { key:"trafico", 
        name: "Estimated traffic, vehicler per day", type: "slider", range: [0, 1000] },
      { key:"albedo",
        name: "“How reflective are the surfaces in the area? (Albedo from 0 to 1)", type: "slider", range: [0, 1], useDecimal: true}
    ],
  },

  "industrial zone": {
    color: "#6366F1",
    parameters: [
      { key:"ch4", 
        name: "CH4 emissions (m^3)", type: "slider", range: [0, 25000] },
      { key:"c02",
        name: "CO2 emissions (m^3)", type: "slider", range: [0, 25000] },
      { key:"n2o",
        name: "NO2 emissions (m^3)", type: "slider", range: [0, 25000] },
      { key:"industries_used",
        name: "Type of industry", type: "dropdown-industry" },
    ],
  },
  "green zone": {
    color: "#10B981",
    parameters: [
      { key: "arboles",
        name: "Amount of trees (Trees/Hectare)", type: "slider", range: [0, 1000] },
      { key: "pasto",
        name: "Grass cover (Percentage)", type: "slider", range: [0, 100] },
      { key: "agua",
        name: "Is there a water body in the zone?", type: "bool", range: [0, 1] },
      { key: "copa",
        name: "Tree canopy cover (Percentage)", type: "slider", range: [0, 100] }, 

    ],
    
  },
} as const;


