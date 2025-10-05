import { useState } from "react";
import PolygonDrawer from "./PolygonDrawer";

export default function GreenGridZoneSelector() {
  const [environmentData, setEnvironmentData] = useState({
    aq_mean: { baseline: 0, post: 0, delta: 0 },
    ndvi_mean: { baseline: 0, post: 0, delta: 0 },
    temp_mean: { baseline: 0, post: 0, delta: 0 },
  });

  const handleEnvironmentUpdate = (data: any) => {
    console.log("🌍 Updating parameters:", data);

    if (data.baseline && data.post_simulation && data.delta) {
      setEnvironmentData({
        aq_mean: {
          baseline: data.baseline.aq_mean_0_100 || 0,
          post: data.post_simulation.aq_mean_0_100 || 0,
          delta: data.delta.aq_mean_0_100 || 0,
        },
        ndvi_mean: {
          baseline: data.baseline.ndvi_mean || 0,
          post: data.post_simulation.ndvi_mean || 0,
          delta: data.delta.ndvi_mean || 0,
        },
        temp_mean: {
          baseline: data.baseline.temp_c_mean || 0,
          post: data.post_simulation.temp_c_mean || 0,
          delta: data.delta.temp_c_mean || 0,
        },
      });
    }
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals);
  };

  const getChangeColor = (delta: number, inverse: boolean = false): string => {
    if (delta === 0) return "bg-gray-900";
    const isGood = inverse ? delta < 0 : delta > 0;
    return isGood ? "bg-green-600" : "bg-red-600";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f2f2f2ff" }}>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-300"
          style={{ height: "800px" }}
        >
          <PolygonDrawer
            onEnvironmentUpdate={handleEnvironmentUpdate}
            latitude={29.0729}
            longitude={-110.9559}
            buffer={50000}
          />
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Information</h3>
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-sm font-bold">i</span>
            </div>
            <p className="text-green-600 font-semibold">*Impact of changes</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900 min-w-[200px]">
                Air Quality (AQI):
              </span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-900 text-white px-4 py-1 rounded font-bold min-w-[60px] text-center">
                  {environmentData.aq_mean.baseline === 0
                    ? "0.0"
                    : formatNumber(environmentData.aq_mean.baseline, 1)}
                </div>
                <span className="text-2xl">→</span>
                <div
                  className={`text-white px-4 py-1 rounded font-bold min-w-[60px] text-center ${getChangeColor(
                    environmentData.aq_mean.delta,
                    true
                  )}`}
                >
                  {environmentData.aq_mean.post === 0
                    ? "0.0"
                    : formatNumber(environmentData.aq_mean.post, 1)}
                </div>
                {environmentData.aq_mean.delta !== 0 && (
                  <span
                    className={`text-sm font-semibold ${
                      environmentData.aq_mean.delta < 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ({environmentData.aq_mean.delta > 0 ? "+" : ""}
                    {formatNumber(environmentData.aq_mean.delta, 1)})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900 min-w-[200px]">
                Vegetation (NDVI):
              </span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-900 text-white px-4 py-1 rounded font-bold min-w-[60px] text-center">
                  {environmentData.ndvi_mean.baseline === 0
                    ? "0.000"
                    : formatNumber(environmentData.ndvi_mean.baseline, 3)}
                </div>
                <span className="text-2xl">→</span>
                <div
                  className={`text-white px-4 py-1 rounded font-bold min-w-[60px] text-center ${getChangeColor(
                    environmentData.ndvi_mean.delta,
                    false
                  )}`}
                >
                  {environmentData.ndvi_mean.post === 0
                    ? "0.000"
                    : formatNumber(environmentData.ndvi_mean.post, 3)}
                </div>
                {environmentData.ndvi_mean.delta !== 0 && (
                  <span
                    className={`text-sm font-semibold ${
                      environmentData.ndvi_mean.delta > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ({environmentData.ndvi_mean.delta > 0 ? "+" : ""}
                    {formatNumber(environmentData.ndvi_mean.delta, 3)})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900 min-w-[200px]">
                Temperature (°C):
              </span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-900 text-white px-4 py-1 rounded font-bold min-w-[60px] text-center">
                  {environmentData.temp_mean.baseline === 0
                    ? "0.0"
                    : formatNumber(environmentData.temp_mean.baseline, 1)}
                </div>
                <span className="text-2xl">→</span>
                <div
                  className={`text-white px-4 py-1 rounded font-bold min-w-[60px] text-center ${getChangeColor(
                    environmentData.temp_mean.delta,
                    true
                  )}`}
                >
                  {environmentData.temp_mean.post === 0
                    ? "0.0"
                    : formatNumber(environmentData.temp_mean.post, 1)}
                </div>
                {environmentData.temp_mean.delta !== 0 && (
                  <span
                    className={`text-sm font-semibold ${
                      environmentData.temp_mean.delta < 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ({environmentData.temp_mean.delta > 0 ? "+" : ""}
                    {formatNumber(environmentData.temp_mean.delta, 1)}°C)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
