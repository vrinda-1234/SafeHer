export default function RouteSummary({
  tracking,
  distance = 0,
  eta = 0,
}) {
  return (
    <div className="bg-white font-inter rounded-3xl shadow-lg p-5 mt-5">
      
      <div className="grid grid-cols-3 gap-4">
        
        <div className="bg-violet-50 rounded-2xl p-4 text-center">
          <p className="text-lg font-syne text-gray-500 mb-1">
            Status
          </p>

          <p
            className={`font-bold text-lg ${
              tracking
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {tracking ? "Active" : "Idle"}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-lg font-syne text-gray-500 mb-1">
            Distance
          </p>

          <p className="font-bold text-lg text-blue-600">
            {(distance / 1000).toFixed(1)} km
          </p>
        </div>

        <div className="bg-orange-50 rounded-2xl p-4 text-center">
          <p className="text-lg font-syne text-gray-500 mb-1">
            ETA
          </p>

          <p className="font-bold text-lg text-orange-600">
            {eta} min
          </p>
        </div>

      </div>
    </div>
  );
}