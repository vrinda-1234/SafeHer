import React, { useState, useEffect } from "react";
import axios from "axios";

const EmergencySOS = () => {
  const [step, setStep] = useState("idle");
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // store last sent location
  let lastLat = null;
  let lastLng = null;

  // Load emergency contacts
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setContacts(parsed.emergencyContacts || []);
    }
  }, []);

  // Step 1: Get current location
  const getLocationAndConfirm = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
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
      () => alert("Location permission denied")
    );
  };

  // Start live tracking
  const startTracking = () => {
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // ignore very tiny GPS movement
        if (lastLat && lastLng) {
          const diff = Math.abs(lat - lastLat) + Math.abs(lng - lastLng);
          if (diff < 0.0001) return;
        }

        lastLat = lat;
        lastLng = lng;

        try {
          const token = localStorage.getItem("token");

          await axios.patch(
            "http://localhost:5001/api/sos/update-location",
            { lat, lng },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Location updated:", lat, lng);
        } catch (err) {
          console.log("Location update error:", err);
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

  // Send SOS
  const sendSOS = async () => {
    if (!location) {
      alert("Location not available");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/sos/trigger",
        {
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      startTracking();
      setStep("sent");
    } catch (error) {
      console.error("SOS error:", error);
      alert("Failed to send SOS");
    }
  };

  // Stop SOS
  const stopSOS = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    setStep("idle");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
        {/* STEP 1 */}
        {step === "idle" && (
          <>
            <h1 className="text-3xl font-bold text-red-700 mb-4">
              🚨 Emergency SOS
            </h1>

            <p className="text-gray-600 mb-6">
              This will alert your trusted contacts with your live location.
            </p>

            <button
              onClick={getLocationAndConfirm}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700"
            >
              Send SOS Alert
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-3">Confirm SOS</h2>

            <p className="text-gray-600 mb-2">Alert will be sent to:</p>

            {contacts.length === 0 ? (
              <p className="text-sm text-red-600 mb-4">
                ⚠️ No emergency contacts found
              </p>
            ) : (
              <ul className="mb-4">
                {contacts.map((c, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    📞 {c.name} ({c.phone})
                  </li>
                ))}
              </ul>
            )}

            {location && (
              <a
                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline text-sm block mb-4"
              >
                📍 View Current Location
              </a>
            )}

            <button
              onClick={sendSOS}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold mb-2"
            >
              Confirm & Send
            </button>

            <button
              onClick={() => setStep("idle")}
              className="w-full border border-gray-400 py-2 rounded-xl"
            >
              Cancel
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === "sent" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-3">
              ✅ SOS Alert Sent
            </h1>

            <p className="text-gray-600 mb-3">
              Emergency contacts are being notified.
            </p>

            <p className="text-sm text-purple-700 mb-4">
              📡 Live location is being shared
            </p>

            <button
              onClick={stopSOS}
              className="w-full border border-gray-400 py-2 rounded-xl"
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
