import { useState } from "react";
import { Download, Copy, Eye, EyeOff, Send } from "lucide-react";
import type { Zone } from "../types/types";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

interface ExportData {
  metadata: {
    exportDate: string;
    totalZones: number;
    totalArea: number;
  };
  zones: Array<{
    id: number;
    type: string;
    area: number;
    coordinates: number[][];
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }>;
}

interface PolygonCoordinateExporterProps {
  zones: Zone[];
  buffer?: number;
  onBatchSendComplete?: (results: any[]) => void;
}

const PolygonCoordinateExporter: React.FC<PolygonCoordinateExporterProps> = ({ 
  zones, 
  buffer = 50000,
  onBatchSendComplete 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);

  // Calcular centroide de un polígono
  const calculateCentroid = (points: { lat: number; lng: number }[]): { lat: number; lng: number } => {
    let latSum = 0, lngSum = 0;
    points.forEach((point) => {
      latSum += point.lat;
      lngSum += point.lng;
    });
    return { lat: latSum / points.length, lng: lngSum / points.length };
  };

  // Enviar múltiples zonas al backend
  const sendBatchToBackend = async () => {
    if (zones.length === 0) {
      alert("No zones to send");
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    const presetMap: { [key: string]: string } = {
      verde: "green_area",
      residencial: "residential",
      industrial: "industrial",
    };

    try {
      // Crear array de promesas para todas las zonas
      const requests = zones.map(async (zone) => {
        const centroid = calculateCentroid(zone.points);

        const payload = {
          preset: presetMap[zone.type],
          latitude: centroid.lat,
          longitude: centroid.lng,
          buffer: buffer,
          geometry: {
            type: "Polygon",
            coordinates: [zone.points.map((p) => [p.lng, p.lat])],
          },
        };

        try {
          const response = await fetch(`${BACKEND_API}/geo/simulate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            zoneId: zone.id,
            zoneType: zone.type,
            data: data.payload,
          };
        } catch (error) {
          console.error(`Error sending zone ${zone.id}:`, error);
          return {
            success: false,
            zoneId: zone.id,
            zoneType: zone.type,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      });

      // Ejecutar todas las peticiones en paralelo
      const results = await Promise.all(requests);

      // Calcular estadísticas
      const successCount = results.filter((r) => r.success).length;
      const failedCount = results.filter((r) => !r.success).length;

      setSendStatus({
        success: successCount,
        failed: failedCount,
        total: zones.length,
      });

      // Callback con los resultados
      if (onBatchSendComplete) {
        onBatchSendComplete(results);
      }

      console.log("✅ Batch send completed:", results);
    } catch (error) {
      console.error("❌ Critical error in batch send:", error);
      alert("Critical error sending zones. Check console for details.");
    } finally {
      setIsSending(false);
    }
  };

  // Generar datos de exportación
  const generateExportData = (): ExportData => {
    const totalArea = zones.reduce((sum, zone) => sum + zone.area, 0);

    return {
      metadata: {
        exportDate: new Date().toISOString(),
        totalZones: zones.length,
        totalArea: parseFloat(totalArea.toFixed(2)),
      },
      zones: zones.map((zone) => ({
        id: zone.id,
        type: zone.type,
        area: parseFloat(zone.area.toFixed(2)),
        coordinates: zone.points.map((p) => [
          parseFloat(p.lng.toFixed(6)),
          parseFloat(p.lat.toFixed(6)),
        ]),
        geometry: {
          type: "Polygon",
          coordinates: [
            zone.points.map((p) => [
              parseFloat(p.lng.toFixed(6)),
              parseFloat(p.lat.toFixed(6)),
            ]),
          ],
        },
      })),
    };
  };

  // Descargar JSON
  const downloadJSON = () => {
    const data = generateExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `polygon-coordinates-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copiar al portapapeles
  const copyToClipboard = async () => {
    const data = generateExportData();
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  // Preview del JSON
  const jsonPreview = JSON.stringify(generateExportData(), null, 2);

  if (zones.length === 0) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
        <div className="text-4xl mb-2">📍</div>
        <p className="text-gray-600 font-medium">No zones to export</p>
        <p className="text-sm text-gray-500 mt-1">
          Draw some polygons first to export coordinates
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">📤</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Coordinate Exporter
            </h3>
            <p className="text-blue-100 text-sm">
              Export {zones.length} zone{zones.length !== 1 ? "s" : ""} to JSON
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{zones.length}</p>
            <p className="text-xs text-gray-600 font-medium">Zones</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {zones.reduce((sum, z) => sum + z.points.length, 0)}
            </p>
            <p className="text-xs text-gray-600 font-medium">Total Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {(
                zones.reduce((sum, z) => sum + z.area, 0) / 10000
              ).toFixed(1)}
            </p>
            <p className="text-xs text-gray-600 font-medium">Total Area (ha)</p>
          </div>
        </div>
      </div>

      {/* Send Status */}
      {sendStatus && (
        <div className={`p-4 ${sendStatus.failed === 0 ? 'bg-green-50' : 'bg-yellow-50'} border-b ${sendStatus.failed === 0 ? 'border-green-200' : 'border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">
                {sendStatus.failed === 0 ? '✅ All zones sent successfully!' : '⚠️ Batch send completed with errors'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Success: {sendStatus.success} | Failed: {sendStatus.failed} | Total: {sendStatus.total}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 space-y-3">
        {/* Botón principal: Enviar al backend */}
        <button
          onClick={sendBatchToBackend}
          disabled={isSending}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
            isSending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
          }`}
        >
          <Send size={20} />
          {isSending ? `Sending ${zones.length} zones...` : `Send All Zones to Backend`}
        </button>

        <button
          onClick={downloadJSON}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Download size={20} />
          Download JSON File
        </button>

        <button
          onClick={copyToClipboard}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md ${
            copied
              ? "bg-green-500 text-white"
              : "bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }`}
        >
          <Copy size={20} />
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* JSON Preview */}
      {showPreview && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-xs text-green-400 font-mono">{jsonPreview}</pre>
          </div>
        </div>
      )}

      {/* Zone List */}
      <div className="p-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🗺️</span>
          Zone Details
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800 capitalize">
                  {zone.type}
                </span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                  {zone.points.length} points
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Area:</span>{" "}
                {zone.area < 10000
                  ? `${Math.round(zone.area)} m²`
                  : `${(zone.area / 10000).toFixed(2)} ha`}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ID: {zone.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolygonCoordinateExporter;