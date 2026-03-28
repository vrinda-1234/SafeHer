import React, { useState, useEffect, useRef } from "react";
import API from "../utils/api";

const EmergencySOS = () => {
  const [step, setStep] = useState("idle");
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [sosId, setSosId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingLink, setTrackingLink] = useState("");

  const lastLat = useRef(null);
  const lastLng = useRef(null);

  // 🔥 Load contacts
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await API.get("/api/contact");
        setContacts(res.data);
      } catch {
        setErrorMsg("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // 🔥 Resume active SOS
  useEffect(() => {
    const checkActiveSOS = async () => {
      try {
        const res = await API.get("/api/sos/my");
        const activeSOS = res.data.find((s) => s.status === "ACTIVE");

        if (activeSOS) {
          setSosId(activeSOS._id);
          setLocation(activeSOS.location);
          setStep("sent");
          setErrorMsg("⚠️ Resumed your previous SOS");

          const link = `http://localhost:3000/track/${activeSOS._id}`;
          setTrackingLink(link);

          startTracking();
        }
      } catch {
        console.log("No active SOS");
      }
    };

    checkActiveSOS();
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [step]);

  // 🔥 Get location
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

  // 🔥 Start tracking
  const startTracking = () => {
    if (watchId !== null) return;

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (lastLat.current && lastLng.current) {
          const diff =
            Math.abs(lat - lastLat.current) + Math.abs(lng - lastLng.current);
          if (diff < 0.0001) return;
        }

        lastLat.current = lat;
        lastLng.current = lng;
        setLocation({ lat, lng });

        try {
          await API.patch("/api/sos/update-location", { lat, lng });
        } catch {
          console.log("Location update failed");
        }
      },
      (error) => console.log("Geolocation error:", error),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    setWatchId(id);
  };

  // 🔥 Send SOS
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
      const res = await API.post("/api/sos/trigger", { location });

      const link = `http://localhost:3000/track/${res.data.sosId}`;
      setTrackingLink(link);

      // 🔥 AUTO COPY
      navigator.clipboard.writeText(link);

      setSosId(res.data.sosId);

      startTracking();
      setStep("sent");
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "You already have an active SOS") {
        const res = await API.get("/api/sos/my");
        const activeSOS = res.data.find((s) => s.status === "ACTIVE");

        if (activeSOS) {
          const link = `http://localhost:3000/track/${activeSOS._id}`;

          setSosId(activeSOS._id);
          setLocation(activeSOS.location);
          setTrackingLink(link);
          setErrorMsg("⚠️ Resumed your previous SOS");

          navigator.clipboard.writeText(link);

          setStep("sent");
          startTracking();
        }
        return;
      }

      setErrorMsg(message || "Failed to send SOS");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Stop SOS
  const stopSOS = async () => {
    if (!window.confirm("Are you sure you want to stop SOS?")) return;

    try {
      if (sosId) {
        await API.put(`/api/sos/${sosId}/resolve`);
      }
    } catch {
      console.log("Resolve failed");
    }

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    setStep("idle");
    lastLat.current = null;
    lastLng.current = null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
        {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}

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

            <ul className="mb-4 space-y-2">
              {contacts.map((c) => (
                <li
                  key={c._id}
                  className="border rounded-lg p-2 flex justify-between"
                >
                  <span>{c.name}</span>
                  <span className="text-sm text-gray-500">{c.phone}</span>
                </li>
              ))}
            </ul>

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

        {step === "sent" && (
          <>
            {/* 🔥 NEW IMPROVED LINK UI */}
            <p className="text-green-700 font-semibold text-sm mb-1">
              🔗 Send this link to your emergency contacts
            </p>

            <div className="flex mb-4">
              <input
                value={trackingLink}
                readOnly
                className="flex-1 border border-gray-300 p-2 rounded-l-lg bg-gray-50 text-sm focus:outline-none"
              />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(trackingLink);
                  alert("Link copied!");
                }}
                className="bg-blue-600 text-white px-4 rounded-r-lg"
              >
                Copy
              </button>
            </div>

            <h1 className="text-2xl font-bold text-green-600 mb-3">
              🚨 SOS ACTIVE
            </h1>

            <p className="text-red-600 font-medium mb-2">
              Your location is being shared
            </p>

            <p className="text-sm text-gray-600 mb-4">
              Stay safe. Help is on the way.
            </p>

            <p className="text-purple-700 mb-4">
              📡 Live location sharing active
            </p>

            {location && (
              <iframe
                title="Live Location"
                width="100%"
                height="200"
                className="rounded-lg mb-4"
                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
              />
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
