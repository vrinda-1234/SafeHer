import React, { useState, useEffect, useRef } from "react";
import API from "../utils/api";

const EmergencySOS = () => {
  const FRONTEND_URL =
    import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000";

  const [step, setStep] = useState("idle");
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [sosId, setSosId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingLink, setTrackingLink] = useState("");

  const lastLat = useRef(null);
  const lastLng = useRef(null);
  const watchRef = useRef(null);

  // stable idempotency key
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  // -------------------------
  // LOAD CONTACTS
  // -------------------------
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/contact", {
          withCredentials: true,
        });
        setContacts(res.data || []);
      } catch {
        setErrorMsg("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // -------------------------
  // RESET ERROR
  // -------------------------
  useEffect(() => {
    setErrorMsg("");
  }, [step]);

  // -------------------------
  // GET LOCATION
  // -------------------------
  const getLocationAndConfirm = () => {
    setErrorMsg("");

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation not supported");
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
      () => setErrorMsg("Location permission denied")
    );
  };

  // -------------------------
  // LIVE TRACKING
  // -------------------------
  const startTracking = (id) => {
    if (watchRef.current !== null) return;

    const watch = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // safer movement check
        if (lastLat.current !== null && lastLng.current !== null) {
          const moved =
            Math.abs(lat - lastLat.current) + Math.abs(lng - lastLng.current);

          if (moved < 0.0002) return;
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
          console.log("Location update failed:", err?.message);
        }
      },
      (error) => console.log("Geolocation error:", error),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    watchRef.current = watch;
  };

  // -------------------------
  // SEND SOS
  // -------------------------
  const sendSOS = async () => {
    if (contacts.length === 0) {
      setErrorMsg("⚠️ Add at least one emergency contact first");
      return;
    }

    if (!location) {
      setErrorMsg("Location not available");
      return;
    }

    if (step === "sent") return;

    setLoading(true);

    try {
      const res = await API.post(
        "/api/sos/trigger",
        {
          location,
          idempotencyKey: idempotencyKeyRef.current,
        },
        { withCredentials: true }
      );

      const id = res.data.sosId;

      setSosId(id);
      setTrackingLink(`${FRONTEND_URL}/track/${id}`);

      startTracking(id);
      setStep("sent");
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "You already have an active SOS") {
        const res = await API.get("/api/sos/my", {
          withCredentials: true,
        });

        const activeSOS = res.data.find((s) => s.status === "ACTIVE");

        if (activeSOS) {
          const id = activeSOS._id;

          setSosId(id);
          setLocation(activeSOS.location);
          setTrackingLink(`${FRONTEND_URL}/track/${id}`);

          startTracking(id);
          setStep("sent");
        }
        return;
      }

      setErrorMsg(message || "Failed to send SOS");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // STOP SOS
  // -------------------------
  const stopSOS = async () => {
    if (!window.confirm("Are you sure you want to stop SOS?")) return;

    try {
      if (sosId) {
        await API.put(
          `/api/sos/${sosId}/resolve`,
          {},
          { withCredentials: true }
        );
      }
    } catch (err) {
      console.log("Resolve failed:", err?.message);
    }

    if (watchRef.current !== null) {
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
  // CLEANUP
  // -------------------------
  useEffect(() => {
    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, []);

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
        {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}

        {/* IDLE */}
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

        {/* CONFIRM */}
        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-3">Confirm SOS</h2>

            <button
              onClick={sendSOS}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl disabled:opacity-50"
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

        {/* ACTIVE */}
        {step === "sent" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-3">
              🚨 SOS ACTIVE
            </h1>

            {location && (
              <iframe
                title="Live Location"
                width="100%"
                height="200"
                className="rounded-lg mb-4"
                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
              />
            )}

            {trackingLink && (
              <a
                href={trackingLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm block mb-3"
              >
                Open Tracking Page
              </a>
            )}

            <button onClick={stopSOS} className="w-full border py-2 rounded-xl">
              Stop SOS
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmergencySOS;
