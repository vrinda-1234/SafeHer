import React, { useState, useEffect } from "react";

const LiveLocation = () => {
  const [sharing, setSharing] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sharing) return;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(5),
          lng: position.coords.longitude.toFixed(5),
        });
        setLoading(false);
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [sharing]);

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-4">
          📍 Live Location
        </h1>

        <p className="text-gray-600 mb-6">
          Share your live location with trusted contacts in real time.
        </p>

        {!sharing ? (
          <button
            onClick={() => {
              setError("");
              setLocation(null);
              setSharing(true);
            }}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Start Sharing Location
          </button>
        ) : (
          <>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
              {loading && (
                <p className="text-sm text-gray-600">📡 Fetching location...</p>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              {location && (
                <>
                  <p className="text-sm text-purple-700 font-medium">
                    Location Sharing Active
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Lat: {location.lat} | Long: {location.lng}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setSharing(false)}
              className="w-full border border-purple-500 text-purple-700 py-3 rounded-xl font-semibold hover:bg-purple-100 transition"
            >
              Stop Sharing
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveLocation;
