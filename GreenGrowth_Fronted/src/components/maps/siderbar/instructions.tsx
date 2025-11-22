export default function Instruction() {

    return(
 <>
      <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-2xl p-5 max-w-xs backdrop-blur-sm bg-opacity-95 z-[1000]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📍</span>
          <h4 className="text-lg font-bold text-gray-800">Instructions</h4>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex gap-2">
            <span className="font-bold text-indigo-600">1.</span>
            <span>Select a zone type above</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-indigo-600">2.</span>
            <span>Click on the map to add points</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-indigo-600">3.</span>
            <span>
              Press{" "}
              <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                Enter
              </kbd>{" "}
              to finish
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-indigo-600">4.</span>
            <span>
              Press{" "}
              <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                Esc
              </kbd>{" "}
              to cancel
            </span>
          </div>
        </div>
      </div>
    </>
    );
}