export default function RouteSummary({ tracking }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 mb-5">
      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="text-gray-500 text-sm">Distance</p>
          <p className="font-bold">12.3 km</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">ETA</p>
          <p className="font-bold">24 min</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Status</p>
          <p className="font-bold text-green-600">
            {tracking ? "Active" : "Idle"}
          </p>
        </div>
      </div>
    </div>
  );
}
