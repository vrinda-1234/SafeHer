import React, { useState, useEffect, useRef } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

const EmergencySOS = () => {
  const FRONTEND_URL =
    import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000";

  const [step, setStep] = useState("idle");
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [sosId, setSosId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trackingLink, setTrackingLink] = useState("");

  const lastLat = useRef(null);
  const lastLng = useRef(null);
  const watchRef = useRef(null);

  // -------------------------
  // LOAD CONTACTS
  // -------------------------
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await API.get("/api/contact", {
          withCredentials: true,
        });
        setContacts(res.data || []);
      } catch {
        toast.error("Failed to load contacts");
      }
    };

    fetchContacts();
  }, []);

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
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStep("confirm");
      },
      () => {
        toast.error("Failed to fetch location");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  // -------------------------
  // LIVE TRACKING
  // -------------------------
  const startTracking = (id) => {
    if (watchRef.current !== null) return;

    watchRef.current = navigator.geolocation.watchPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (
        lastLat.current !== null &&
        lastLng.current !== null &&
        Math.abs(lat - lastLat.current) + Math.abs(lng - lastLng.current) <
          0.0002
      ) {
        return;
      }

      lastLat.current = lat;
      lastLng.current = lng;

      setLocation({ lat, lng });

      try {
        await API.patch(
          "/api/sos/update-location",
          { sosId: id, lat, lng },
          { withCredentials: true }
        );
      } catch (err) {
        console.log("Location update failed");
      }
    });
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
        {
          location,
          message: "Emergency SOS",
        },
        { withCredentials: true }
      );

      const msg = res.data?.message;

      // -------------------------
      // HANDLE BACKEND STATES
      // -------------------------
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
      setTrackingLink(`${FRONTEND_URL}/track/${id}`);
      setStep("sent");

      startTracking(id);
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
          {
            withCredentials: true,
          }
        );
      }

      toast.success("SOS resolved");
    } catch {
      toast.error("Failed to resolve SOS");
    }

    if (watchRef.current) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }

    setStep("idle");
    setSosId(null);
    setTrackingLink("");
    setLocation(null);

    lastLat.current = null;
    lastLng.current = null;
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
        {step === "idle" && (
          <>
            <h1 className="text-3xl font-bold text-red-700 mb-4">
              🚨 Emergency SOS
            </h1>

            <button
              onClick={getLocationAndConfirm}
              className="w-full bg-red-600 text-white py-3 rounded-xl"
            >
              Send SOS Alert
            </button>
          </>
        )}

        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-3">Confirm SOS</h2>

            <button
              onClick={sendSOS}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl"
            >
              {loading ? "Sending..." : "Confirm & Send"}
            </button>

            <button
              onClick={() => setStep("idle")}
              className="w-full border py-2 rounded-xl mt-2"
            >
              Cancel
            </button>
          </>
        )}

        {step === "sent" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-3">
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
