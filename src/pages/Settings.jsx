import React, { useState, useEffect } from "react";

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("safeher-settings");

    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          notifications: true,
          darkMode: false,
        };
  });

  // Save settings automatically
  useEffect(() => {
    localStorage.setItem(
      "safeher-settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  // Apply dark mode
//   useEffect(() => {
//     if (settings.darkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [settings.darkMode]);

//   const toggleDarkMode = () => {
//     setSettings((prev) => ({
//       ...prev,
//       darkMode: !prev.darkMode,
//     }));
//   };

  const toggleNotifications = async () => {
    if (!settings.notifications) {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Notification permission denied.");
        return;
      }
    }

    setSettings((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  const SettingRow = ({
    title,
    description,
    value,
    onChange,
  }) => (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div>
        <h4 className="font-semibold text-gray-800">
          {title}
        </h4>

        <p className="text-sm text-gray-500">
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        className={`w-14 h-7 rounded-full transition relative ${
          value ? "bg-pink-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
            value ? "left-8" : "left-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* STATUS CARD */}
      <div className="bg-gradient-to-r from-blue-900 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          🛡 SafeHer Protection Status
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm opacity-90">
              Notifications
            </p>

            <p className="font-semibold">
              {settings.notifications
                ? "Enabled"
                : "Disabled"}
            </p>
          </div>

          <div>
            <p className="text-sm opacity-90">
              Appearance
            </p>

            <p className="font-semibold">
              {settings.darkMode
                ? "Dark Mode"
                : "Light Mode"}
            </p>
          </div>

          <div>
            <p className="text-sm opacity-90">
              Encryption
            </p>

            <p className="font-semibold">
              Active
            </p>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-pink-600 mb-4">
          🔔 Notifications
        </h2>

        <SettingRow
          title="Notification Alerts"
          description="Receive important alerts and updates from SafeHer."
          value={settings.notifications}
          onChange={toggleNotifications}
        />
      </div>

      {/* SECURITY */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">
          🔒 Security
        </h2>

        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="font-semibold text-gray-800">
              Data Encryption
            </h4>

            <p className="text-sm text-gray-500">
              Your personal and emergency data is securely protected.
            </p>
          </div>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Active
          </span>
        </div>
      </div>

      {/* APPEARANCE */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-purple-600 mb-4">
          🌙 Appearance
        </h2>

        <SettingRow
          title="Dark Mode"
          description="Switch between light and dark themes."
          value={settings.darkMode}
        //   onChange={toggleDarkMode}
        />
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() =>
            alert("Settings saved successfully!")
          }
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;