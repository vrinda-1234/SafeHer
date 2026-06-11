import React, { useEffect, useRef, useState } from "react";
import { Navigation, Play, Square } from "lucide-react";
import { haversine } from "../utils/geo";
import {
  startTripAPI,
  endTripAPI,
  getActiveTripAPI,
  triggerSOSAPI,
} from "../services/tripService";

import RouteSummary from "../components/RouteSummary";
import RouteMap from "../components/RouteMap";
import AlertCard from "../components/AlertCard";
import FloatingActions from "../components/FloatingActions";

const SEND_INTERVAL = 3000;
const DEVIATION_LIMIT = 500;
const STREAK_LIMIT = 3;

export default function SafeRoutePage() {
  const [destination, setDestination] = useState("");
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [offRoute, setOffRoute] = useState(false);
  const [streak, setStreak] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const locationRef = useRef(null);
  const watchIdRef = useRef(null);
  const intervalRef = useRef(null);

  const tripRef = useRef(null);
  const streakRef = useRef(0);

  // ---------------- GPS ----------------
  const startGPS = () => {
    watchIdRef.current = navigator.geolocation.watchPosition((pos) => {
      const loc = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      locationRef.current = loc;
      setUserLocation(loc); // 👈 LIVE UI UPDATE
    });
  };

  const stopGPS = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  };

  // ---------------- START ----------------
  const startTrip = async () => {
    if (!destination) return alert("Enter destination");
    if (!locationRef.current) return alert("Waiting for GPS");

    const data = await startTripAPI(locationRef.current, {
      lat: 28.6139,
      lng: 77.209,
    });

    tripRef.current = data.trip;

    setTracking(true);
    setStatus("Active");

    startGPS();
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

      if (streakRef.current >= STREAK_LIMIT) {
        await triggerSOSAPI(locationRef.current);
        streakRef.current = 0;
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
    intervalRef.current = setInterval(checkDeviation, SEND_INTERVAL);
  };

  const stopMonitoring = () => {
    clearInterval(intervalRef.current);
  };

  // ---------------- STOP ----------------
  const stopTrip = async () => {
    setTracking(false);
    setOffRoute(false);
    setStatus("Stopped");

    stopGPS();
    stopMonitoring();

    await endTripAPI();
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    getActiveTripAPI().then((data) => {
      if (data?.trip) {
        tripRef.current = data.trip;
        setTracking(true);
        setStatus("Restored Trip");
      }
    });

    return () => {
      stopGPS();
      stopMonitoring();
    };
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-purple-50 p-4">
      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-lg p-5 mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🛡 Safe Route
        </h2>

        <p className="text-gray-600 text-sm mt-1">
          AI-powered route safety monitoring
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white rounded-3xl shadow-lg p-5 mb-5">
        <div className="relative mb-4">
          <Navigation className="absolute left-3 top-3 text-violet-500" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border rounded-xl pl-10 p-3"
            placeholder="Enter destination"
          />
        </div>

        {!tracking ? (
          <button
            onClick={startTrip}
            className="w-full bg-violet-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Play /> Start Trip
          </button>
        ) : (
          <button
            onClick={stopTrip}
            className="w-full bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Square /> Stop Trip
          </button>
        )}
      </div>

      {/* STATUS */}
      <RouteSummary tracking={tracking} />

      {/* MAP */}
      <RouteMap
        userLocation={userLocation}
        routePoints={tripRef.current?.routePoints}
        destination={tripRef.current?.destination}
      />

      {/* ALERT */}
      <AlertCard
        show={offRoute}
        onSOS={() => triggerSOSAPI(locationRef.current)}
      />

      {/* FLOATING */}
      <FloatingActions />
    </div>
  );
}
