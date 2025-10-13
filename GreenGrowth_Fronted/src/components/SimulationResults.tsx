import React, { useState } from 'react';
import { ChevronDown, Thermometer, Leaf, Wind } from 'lucide-react';

// --- Mock Data ---
const simulationPayload = {
  baseline: {
    aq_mean_0_100: null,
    ndvi_mean: null,
    temp_c_mean: 47.57893719245228,
  },
  delta: {
    aq_mean_0_100: null,
    ndvi_mean: 0.12,
    temp_c_mean: -1.5,
  },
  post: {
    aq_mean_0_100: null,
    ndvi_mean: null,
    temp_c_mean: null,
  },
};

// --- Helper functions ---
const formatValue = (value: number | null, unit: string = ''): string => {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(1)}${unit}`;
};

const formatDelta = (delta: number | null, unit: string = ''): string => {
  if (delta === null || delta === undefined) return 'No change detected';
  const sign = delta > 0 ? '+' : '';
  return `Change: ${sign}${delta.toFixed(1)}${unit}`;
};

// --- KPICard Component ---
interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  colorClass?: string;
  iconBgClass?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  icon,
  title,
  value,
  subtitle,
  colorClass = 'text-blue-600',
  iconBgClass = 'bg-blue-100',
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 h-full border border-gray-200">
      <div className="p-4 flex items-center">
        <div className={`${iconBgClass} ${colorClass} p-3 rounded-xl mr-4 flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const SimulationResults: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { baseline, delta } = simulationPayload;

  return (
    <div className="bg-lime-100/50 relative hover:bg-black/5 transition-colors duration-200">
      <div
        className="flex items-center justify-between p-4 px-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Simulation Results
        </h2>
        <button
          className={`text-gray-700 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Temperature Card */}
            <KPICard
              title="Avg. Surface Temperature"
              value={formatValue(baseline.temp_c_mean, '°C')}
              subtitle={formatDelta(delta.temp_c_mean, '°C')}
              icon={<Thermometer size={24} />}
              colorClass="text-orange-600"
              iconBgClass="bg-orange-100"
            />

            {/* NDVI Card */}
            <KPICard
              title="Vegetation Index (NDVI)"
              value={formatValue(baseline.ndvi_mean)}
              subtitle={formatDelta(delta.ndvi_mean)}
              icon={<Leaf size={24} />}
              colorClass="text-green-600"
              iconBgClass="bg-green-100"
            />

            {/* AQI Card */}
            <KPICard
              title="Air Quality Index (AQI)"
              value={formatValue(baseline.aq_mean_0_100)}
              subtitle={formatDelta(delta.aq_mean_0_100)}
              icon={<Wind size={24} />}
              colorClass="text-blue-600"
              iconBgClass="bg-blue-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;