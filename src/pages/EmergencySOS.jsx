import React, { useState, useEffect, useRef } from "react";
import API from "../utils/api";

const EmergencySOS = () => {
  const [step, setStep] = useState("idle");
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [sosId, setSosId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 FIX: persistent refs (no reset)
  const lastLat = useRef(null);
  const lastLng = useRef(null);

  // 🔥 Load contacts from backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await API.get("/api/contact");
        setContacts(res.data);
      } catch (err) {
        setErrorMsg("Failed to load contacts");
      }
    };

    fetchContacts();
  }, []);

  // STEP 1: Get location
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

  // 🔥 START TRACKING (CLEAN)
  const startTracking = () => {
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // ignore tiny movement
        if (lastLat.current && lastLng.current) {
          const diff =
            Math.abs(lat - lastLat.current) + Math.abs(lng - lastLng.current);

          if (diff < 0.0001) return;
        }

        lastLat.current = lat;
        lastLng.current = lng;

        try {
          await API.patch("/api/sos/update-location", { lat, lng });
        } catch {
          console.log("Location update failed");
        }
      },
      (error) => {
        console.log("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    setWatchId(id);
  };

  // 🔥 SEND SOS
  const sendSOS = async () => {
    if (!location) {
      setErrorMsg("Location not available");
      return;
    }

    try {
      const res = await API.post("/api/sos/trigger", {
        location,
      });

      setSosId(res.data.sosId);

      startTracking();
      setStep("sent");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send SOS";

      setErrorMsg(message);
    }
  };

  // 🔥 STOP SOS
  const stopSOS = async () => {
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
        {/* 🔥 ERROR UI */}
        {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}

        {/* STEP 1 */}
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

        {/* STEP 2 */}
        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-3">Confirm SOS</h2>

            {contacts.length === 0 ? (
              <p className="text-red-600 mb-3">No emergency contacts found</p>
            ) : (
              <ul className="mb-4">
                {contacts.map((c) => (
                  <li key={c._id}>
                    📞 {c.name} ({c.phone})
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={sendSOS}
              className="w-full bg-red-600 text-white py-3 rounded-xl mb-2"
            >
              Confirm & Send
            </button>

            <button
              onClick={() => setStep("idle")}
              className="w-full border py-2 rounded-xl"
            >
              Cancel
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === "sent" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-3">
              ✅ SOS Sent
            </h1>

            <p className="text-purple-700 mb-4">
              📡 Live location sharing active
            </p>

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
