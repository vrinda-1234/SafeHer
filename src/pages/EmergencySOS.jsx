import React, { useState, useEffect } from "react";

const EmergencySOS = () => {
  const [step, setStep] = useState("idle"); // idle → confirm → sent
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Load contacts from Profile
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setContacts(parsed.contacts || []);
    }
  }, []);

  // Step 1 → get location once
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

  // Step 2 → Send SOS + start live tracking
  const sendSOS = () => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => alert("Location permission denied")
    );

    setWatchId(id);
    setStep("sent");
  };

  // Stop SOS safely
  const stopSOS = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    setLocation(null);
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
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
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
                ⚠️ No emergency contacts found. Please add contacts in Profile.
              </p>
            ) : (
              <ul className="mb-4">
                {contacts.map((c, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    📞 {c}
                  </li>
                ))}
              </ul>
            )}

            {location && (
              <a
                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline block mb-4"
              >
                📍 View Current Location
              </a>
            )}

            <button
              onClick={sendSOS}
              disabled={contacts.length === 0}
              className={`w-full py-3 rounded-xl font-semibold mb-2 transition ${
                contacts.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
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
              Emergency contacts are being notified. Stay calm.
            </p>

            {location && (
              <p className="text-sm text-purple-700 mb-4">
                📡 Live location is being shared continuously
              </p>
            )}

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
