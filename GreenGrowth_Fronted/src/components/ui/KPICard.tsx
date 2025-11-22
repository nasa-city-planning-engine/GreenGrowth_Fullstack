import React from "react";

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  colorClass?: string;
  iconBgClass?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  icon,
  title,
  value,
  subtitle,
  colorClass = "text-blue-600",
  iconBgClass = "bg-blue-100",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 h-full border border-gray-200 flex flex-col items-center justify-center w-full">
      <div className="p-4 flex flex-col items-center justify-center w-full">
        <div className="flex items-center justify-center mb-4 gap-2">
          <div
            className={`${iconBgClass} ${colorClass} p-3 rounded-xl flex items-center justify-center`}
          >
            {icon}
          </div>
          <p className="text-sm font-semibold text-gray-600 text-center">
            {title}
          </p>
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-4">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 text-center">{subtitle}</p>
        )}
      </div>
    </div>
  );
};