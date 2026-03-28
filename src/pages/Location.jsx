import React, { useEffect, useState } from "react";
import API from "../utils/api";

const Location = () => {
  const [position, setPosition] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [label, setLabel] = useState("");
  const [safetyStatus, setSafetyStatus] = useState("Checking...");
  const [tracking, setTracking] = useState(true);

  const [mapUrl, setMapUrl] = useState(
    "https://maps.google.com/maps?q=25.4920,81.8630&z=15&output=embed"
  );

  // 📍 LIVE LOCATION
  useEffect(() => {
    if (!tracking) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setPosition([latitude, longitude]);

        setMapUrl(
          `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
        );

        fetchNearby(latitude, longitude);
      },
      () => alert("Allow location access")
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [tracking]);

  // 📥 GET SAVED PLACES
  const fetchSavedPlaces = async () => {
    try {
      const res = await API.get("/api/location/places");
      setSavedPlaces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  // 🔥 FETCH NEARBY SAFE PLACES
  const fetchNearby = async (lat, lng) => {
    try {
      const res = await API.get(
        `/api/location/nearby?lat=${lat}&lng=${lng}`
      );

      setNearbyPlaces(res.data);
      calculateSafety(res.data, lat, lng);
    } catch (err) {
      console.error(err);
      setSafetyStatus("Error");
    }
  };

  // 📏 DISTANCE FUNCTION
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // 🛡️ SAFETY SCORE
  const calculateSafety = (places, lat, lng) => {
    let score = 0;

    places.forEach((p) => {
      const dist = getDistance(lat, lng, p.lat, p.lng);

      if (p.types.includes("police") && dist < 1) score += 50;
      if (p.types.includes("hospital") && dist < 2) score += 40;
    });

    if (score >= 70) setSafetyStatus("Safe Area");
    else if (score >= 40) setSafetyStatus("Moderate");
    else setSafetyStatus("Low Safety");
  };

  // 💾 SAVE CURRENT LOCATION
  const savePlace = async () => {
    if (!label || !position) return alert("Enter label");

    try {
      const res = await API.post("/api/location/save-place", {
        label,
        latitude: position[0],
        longitude: position[1],
      });

      setSavedPlaces(res.data);
      setLabel("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!position) return <p>📍 Getting location...</p>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold text-purple-900">
        📍 Live Location
      </h1>

      {/* 🛡️ SAFETY */}
      <div
        className={`p-4 rounded-xl text-white ${
          safetyStatus === "Safe Area"
            ? "bg-green-500"
            : safetyStatus === "Moderate"
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
      >
        🛡️ {safetyStatus}
      </div>

      {/* 🗺️ MAP */}
      <div className="h-[1000px] w-full rounded-2xl overflow-hidden shadow-lg border">
        <iframe src={mapUrl} className="w-full h-full"></iframe>
      </div>

      {/* 💾 SAVE PLACE */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Save place (Home, Hostel...)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <button
          onClick={savePlace}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          💾 Save Location
        </button>
      </div>

      {/* 📍 NEARBY SAFE PLACES */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Nearby Safe Places</h2>

        {nearbyPlaces.map((p, i) => {
          const dist = getDistance(
            position[0],
            position[1],
            p.lat,
            p.lng
          );

          return (
            <p key={i}>
              {p.types.includes("police") ? "👮" : "🏥"} {p.name} -{" "}
              {dist.toFixed(2)} km
            </p>
          );
        })}
      </div>

      {/* ⭐ SAVED SAFE LOCATIONS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Your Safe Locations</h2>

        {savedPlaces.length === 0 ? (
          <p className="text-gray-500">No saved places</p>
        ) : (
          savedPlaces.map((p) => {
            const dist = getDistance(
              position[0],
              position[1],
              p.latitude,
              p.longitude
            );

            return (
              <p key={p._id}>
                📌 {p.label} - {dist.toFixed(2)} km
              </p>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Location;