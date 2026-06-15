import React, { useState, useEffect, useRef } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";
import { haversine } from "../utils/haversine";

const SEND_INTERVAL = 3000;
const MIN_DISTANCE_METERS = 15; // use real meters via haversine, same threshold as SoundDetector

const EmergencySOS = () => {
  const FRONTEND_URL =
    process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";

  const [step, setStep] = useState("idle");
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [sosId, setSosId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trackingLink, setTrackingLink] = useState("");
  // FIX: added sosActive state so UI re-renders when SOS status changes
  const [sosActive, setSosActive] = useState(false);

  const lastSentLatRef = useRef(null);
  const lastSentLngRef = useRef(null);
  const currentLatRef = useRef(null);
  const currentLngRef = useRef(null);
  const watchRef = useRef(null);
  const intervalRef = useRef(null);
  const sosIdRef = useRef(null);

  // -------------------------
  // LOAD CONTACTS
  // -------------------------
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await API.get("/api/contact", { withCredentials: true });
        setContacts(res.data || []);
      } catch {
        toast.error("Failed to load contacts");
      }
    };
    fetchContacts();
  }, []);

  // -------------------------
  // PAGE VISIBILITY — push location immediately on tab focus
  // -------------------------
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && sosIdRef.current) {
        sendLocationUpdate(sosIdRef.current, true);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // -------------------------
  // SEND LOCATION UPDATE
  // FIX: replaced raw coordinate subtraction with proper haversine distance check
  // -------------------------
  const sendLocationUpdate = async (id, force = false) => {
    if (!id) return;
    if (currentLatRef.current === null || currentLngRef.current === null)
      return;

    const lat = currentLatRef.current;
    const lng = currentLngRef.current;

    if (!force && lastSentLatRef.current !== null) {
      const distanceMeters = haversine(
        lastSentLatRef.current,
        lastSentLngRef.current,
        lat,
        lng
      );
      if (distanceMeters < MIN_DISTANCE_METERS) return;
    }

    lastSentLatRef.current = lat;
    lastSentLngRef.current = lng;

    try {
      await API.patch(
        "/api/sos/update-location",
        { sosId: id, lat, lng },
        { withCredentials: true }
      );
      console.log("📍 Location sent", { lat, lng });
    } catch (err) {
      console.log("Location update failed:", err);
    }
  };

  // -------------------------
  // LIVE TRACKING
  // -------------------------
  const startTracking = (id) => {
    sosIdRef.current = id;
    setSosActive(true); // FIX: keep state in sync for UI

    if (!watchRef.current) {
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          currentLatRef.current = pos.coords.latitude;
          currentLngRef.current = pos.coords.longitude;
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.log("GPS error:", err),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        sendLocationUpdate(sosIdRef.current);
      }, SEND_INTERVAL);
    }
  };

  const stopTracking = () => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    sosIdRef.current = null;
    setSosActive(false); // FIX: keep state in sync for UI
    lastSentLatRef.current = null;
    lastSentLngRef.current = null;
    currentLatRef.current = null;
    currentLngRef.current = null;
  };

  // -------------------------
  // GET LOCATION
  // -------------------------
  const getLocationAndConfirm = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        currentLatRef.current = lat;
        currentLngRef.current = lng;
        setLocation({ lat, lng });
        setStep("confirm");
      },
      () => toast.error("Failed to fetch location"),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  // -------------------------
  // SEND SOS
  // -------------------------
  const sendSOS = async () => {
    if (!contacts.length) {
      toast.error("Add emergency contacts first");
      return;
    }
    if (!location) {
      toast.error("Location not available");
      return;
    }
    if (step === "sent") return;

    setLoading(true);

    try {
      const res = await API.post(
        "/api/sos/trigger",
        { location, message: "Emergency SOS" },
        { withCredentials: true }
      );

      const msg = res.data?.message;

      if (msg?.toLowerCase().includes("already")) {
        toast.info("SOS already active. Tracking continues.");
      } else if (msg?.toLowerCase().includes("cooldown")) {
        toast.info("Please wait before sending another SOS.");
        return;
      } else {
        toast.success("🚨 SOS sent successfully");
      }

      const id = res.data.sosId;
      setSosId(id);
      setTrackingLink(`${FRONTEND_URL}/public/track/${id}`);
      startTracking(id);
      setStep("sent");
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg || "Failed to send SOS");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // STOP SOS
  // -------------------------
  const stopSOS = async () => {
    if (!window.confirm("Stop SOS?")) return;

    try {
      if (sosId) {
        await API.put(
          `/api/sos/${sosId}/resolve`,
          {},
          { withCredentials: true }
        );
      }
      toast.success("SOS resolved");
    } catch {
      toast.error("Failed to resolve SOS");
    }

    stopTracking();

    setStep("idle");
    setSosId(null);
    setTrackingLink("");
    setLocation(null);
  };

  // -------------------------
  // CLEANUP ON UNMOUNT
  // -------------------------
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6 font-inter">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
        {step === "idle" && (
          <>
            <h1 className="text-3xl font-syne font-bold text-red-700 mb-4">
              🚨 Emergency SOS
            </h1>
            <button
              onClick={getLocationAndConfirm}
              className="w-full font-syne bg-red-600 text-white py-3 rounded-xl"
            >
              Send SOS Alert
            </button>
          </>
        )}

        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold font-syne text-red-700 mb-3">
              Confirm SOS
            </h2>
            <button
              onClick={sendSOS}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl"
            >
              {loading ? "Sending..." : "Confirm & Send"}
            </button>
            <button
              onClick={() => setStep("idle")}
              className="w-full font-syne border py-2 rounded-xl mt-2"
            >
              Cancel
            </button>
          </>
        )}

        {step === "sent" && (
          <>
            <h1 className="text-2xl font-syne font-bold text-green-600 mb-3">
              🚨 SOS ACTIVE
            </h1>

            {location && (
              <iframe
                title="map"
                width="100%"
                height="200"
                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
              />
            )}

            {trackingLink && (
              <p className="text-xs text-gray-500 mt-2 break-all">
                Tracking link:{" "}
                <a href={trackingLink} className="underline">
                  {trackingLink}
                </a>
              </p>
            )}

            {/* FIX: sosActive is now proper state, renders correctly */}
            <p className="text-xs text-gray-400 mt-1">
              SOS status: {sosActive ? "🟢 Tracking active" : "🔴 Inactive"}
            </p>

            <button
              onClick={stopSOS}
              className="w-full border py-2 rounded-xl mt-3"
            >
              Stop SOS
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmergencySOS;
