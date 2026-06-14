import React, { useEffect, useRef, useState } from "react";
import { Navigation, Play, Square } from "lucide-react";
import DeviationModal from "../components/DeviationModal";
import { haversine } from "../utils/haversine";
import {
  startTripAPI,
  endTripAPI,
  getActiveTripAPI,
  triggerSOSAPI,
  updateSOSLocationAPI,
} from "../services/tripService";
import DestinationSearch from "../components/DestinationSearch";
import RouteSummary from "../components/RouteSummary";
import RouteMap from "../components/RouteMap";

const SEND_INTERVAL = 3000;
const DEVIATION_LIMIT = 500;
const STREAK_LIMIT = 3;

export default function SafeRoutePage() {
  const [destination, setDestination] = useState("");
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [offRoute, setOffRoute] = useState(false);
  const [streak, setStreak] = useState(0);
  const [selectedDestination, setSelectedDestination] =
  useState(null);

  const [distanceLeft, setDistanceLeft] = useState(0);
const [eta, setEta] = useState(0);
  
  const [showDeviationPopup, setShowDeviationPopup] = useState(false);
const [countdown, setCountdown] = useState(60);

const sosTrackingRef = useRef(null);
const sosIdRef = useRef(null);
  const locationRef = useRef(null);
  const [trip, setTrip] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const watchIdRef = useRef(null);
  const intervalRef = useRef(null);

  const tripRef = useRef(null);
  const streakRef = useRef(0);
  // ---------------- GPS ----------------
  const startGPS = () => {
  if (watchIdRef.current) return;

  watchIdRef.current = navigator.geolocation.watchPosition(
    (pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      locationRef.current = location;
      setCurrentLocation(location);
    },
    (err) => {
      console.log("GPS Error:", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
    }
  );
};

  const stopGPS = () => {
  if (watchIdRef.current) {
    navigator.geolocation.clearWatch(
      watchIdRef.current
    );

    watchIdRef.current = null;
  }
};

  // ---------------- START ----------------
  const startTrip = async () => {
    if (!selectedDestination) {
  return alert(
    "Please select a destination from suggestions"
  );
}
    if (!locationRef.current) return alert("Waiting for GPS");

    const data = await startTripAPI(
  locationRef.current,
  selectedDestination
);

    tripRef.current = data.trip;
setTrip(data.trip);
    

    setTracking(true);
    setStatus("Active");

    startMonitoring();
  };

  // ---------------- CHECK ----------------
  const checkDeviation = async () => {
    if (!tripRef.current || !locationRef.current) return;

    const route = tripRef.current.routePoints || [];

    let minDist = Infinity;

    for (let p of route) {
      const d = haversine(
        locationRef.current.lat,
        locationRef.current.lng,
        p.lat,
        p.lng
      );
      minDist = Math.min(minDist, d);
    }

    if (minDist > DEVIATION_LIMIT) {
      streakRef.current += 1;
      setStreak(streakRef.current);
      setOffRoute(true);
      setStatus(`Off Route (${streakRef.current})`);

      if (
  streakRef.current >= STREAK_LIMIT &&
  !showDeviationPopup
) {
  setShowDeviationPopup(true);
}
    } else {
      streakRef.current = 0;
      setStreak(0);
      setOffRoute(false);
      setStatus("On Route");
    }
  };

  // ---------------- MONITOR ----------------
  const startMonitoring = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  intervalRef.current = setInterval(
    checkDeviation,
    SEND_INTERVAL
  );
};
const sendSOSLocation = async () => {
  if (!sosIdRef.current) return;
  if (!locationRef.current) return;

  try {
    await updateSOSLocationAPI(
      sosIdRef.current,
      locationRef.current
    );

    console.log(
      "📍 SOS location sent:",
      locationRef.current
    );
  } catch (err) {
    console.log(
      "❌ Failed to update SOS location",
      err
    );
  }
};

  const stopMonitoring = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
};

  // ---------------- STOP ----------------
  const stopTrip = async () => {
    setTracking(false);
    setOffRoute(false);
    setStatus("Stopped");
    setTrip(null);
tripRef.current = null;

    stopGPS();
    stopMonitoring();

    await endTripAPI();
    if (sosTrackingRef.current) {
  clearInterval(sosTrackingRef.current);
  sosTrackingRef.current = null;
}
  };
  const handleSafe = () => {
  setShowDeviationPopup(false);

  streakRef.current = 0;

  setOffRoute(false);

  setCountdown(60);
};

const handleSOS = async () => {
  try {
    const res = await triggerSOSAPI(locationRef.current);

    sosIdRef.current = res.sosId;
    console.log(
  "🚨 SOS activated:",
  sosIdRef.current
);

if (!sosTrackingRef.current) {
  sosTrackingRef.current = setInterval(
    sendSOSLocation,
    3000
  );
}

    setShowDeviationPopup(false);
  } catch (err) {
    console.log(err);
  }
};

  // ---------------- INIT ----------------
  useEffect(() => {
  if (!currentLocation || !trip?.destination) return;

  const d = haversine(
    currentLocation.lat,
    currentLocation.lng,
    trip.destination.lat,
    trip.destination.lng
  );

  setDistanceLeft(d);

  // assume 40 km/h average speed
  const speed = 40000 / 60;

  setEta(Math.ceil(d / speed));
}, [currentLocation, trip]);

  useEffect(() => {
  if (!showDeviationPopup) return;

  let time = 60;

  setCountdown(time);

  const interval = setInterval(async () => {
    time--;

    setCountdown(time);

    if (time <= 0) {
  clearInterval(interval);

  try {
    const res = await triggerSOSAPI(
      locationRef.current
    );

    sosIdRef.current = res.sosId;
    if (!sosTrackingRef.current) {
  sosTrackingRef.current = setInterval(
    sendSOSLocation,
    3000
  );
}
  } catch (err) {
    console.log(err);
  }

  setShowDeviationPopup(false);
}
  }, 1000);

  return () => clearInterval(interval);
}, [showDeviationPopup]);
  useEffect(() => {
    startGPS();
    getActiveTripAPI().then((data) => {
      if (data?.trip) {
  tripRef.current = data.trip;
  setTrip(data.trip);

  setTracking(true);
  setStatus("Restored Trip");

  startMonitoring();
}
    });

    return () => {
      stopGPS();
      stopMonitoring();
      if (sosTrackingRef.current) {
      clearInterval(sosTrackingRef.current);
      sosTrackingRef.current = null;
    }
    };
  }, []);

  // ---------------- UI ----------------
 return (
  <div className="min-h-screen font-inter bg-gradient-to-b from-violet-50 via-white to-purple-50 p-4">
    {/* INPUT SECTION */}
    <div className="bg-white font-inter rounded-3xl shadow-lg p-5 mb-5">

      <div className="mb-4">
  <DestinationSearch
    destination={destination}
    setDestination={setDestination}
    setSelectedDestination={setSelectedDestination}
  />
</div>

      {/* DEBUG INFO */}
      <div className="mb-4 text-sm">
        <p>
          Tracking:
          <span className="font-bold font-inter ml-2">
            {tracking ? "TRUE" : "FALSE"}
          </span>
        </p>

        <p>
          Status:
          <span className="font-bold ml-2">
            {status}
          </span>
        </p>
      </div>

      {/* BUTTON */}
      {!tracking ? (
        <button
          onClick={startTrip}
          className="w-full bg-violet-600 font-syne text-black border-black py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Play size={18} />
          Start Trip
        </button>
      ) : (
        <button
          onClick={stopTrip}
          className="w-full font-syne bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Square size={18} />
          Stop Trip
        </button>
      )}
    </div>

    {/* SUMMARY */}
    <RouteSummary
  tracking={tracking}
  distance={distanceLeft}
  eta={eta}
/>      
    <br></br>
    {/* MAP */}
    <RouteMap
      routePoints={trip?.routePoints || []}
      currentLocation={currentLocation}
      destination={trip?.destination}
    />

    {/* DEVIATION POPUP */}
    <DeviationModal
      show={showDeviationPopup}
      countdown={countdown}
      onSafe={handleSafe}
      onSOS={handleSOS}
    />
  </div>
);
}