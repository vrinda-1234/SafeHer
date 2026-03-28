import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Location from "../pages/Location";
import Profile from "../pages/Profile";
const Dashboard = () => {
  const [active, setActive] = useState("dashboard");
  // const navigate = useNavigate();

  // 🔹 Sidebar
  const Sidebar = () => (
    <div className="w-64 bg-white shadow h-full p-4 space-y-3 font-medium">
      {[
        { name: "Dashboard", key: "dashboard", icon: "🏠" },
        { name: "Emergency SOS", key: "sos", icon: "🚨" },
        { name: "Contacts", key: "contacts", icon: "👥" },
        { name: "Location", key: "location", icon: "📍" },
        { name: "AI Monitoring", key: "ai", icon: "🤖" },
        { name: "Safety Score", key: "score", icon: "📊" },
        { name: "Alerts", key: "alerts", icon: "📜" },
        { name: "Settings", key: "settings", icon: "⚙️" },
      ].map((item) => (
        <div
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`p-3 rounded-lg cursor-pointer flex items-center gap-2 ${
            active === item.key
              ? "bg-purple-200 text-purple-800"
              : "hover:bg-gray-100"
          }`}
        >
          {item.icon} {item.name}
        </div>
      ))}
    </div>
  );

  // 🔹 HOME (your card UI)
  const Home = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-900">
          Welcome to SafeHer
        </h1>
        <p className="text-gray-600 mt-1">
          Choose an action to stay safe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="🚨 Emergency SOS"
          desc="Send instant alert to trusted contacts"
          onClick={() => setActive("sos")}
          red
        />
        <Card
          title="📍 Live Location"
          desc="Share your live location securely"
          onClick={() => setActive("location")}
        />
        <Card
          title="🤖 AI Threat Detection"
          desc="Detect abnormal activity automatically"
          onClick={() => setActive("ai")}
        />
        <Card
          title="👤 Profile"
          desc="View and edit your profile"
          onClick={() => setActive("profile")}
        />
      </div>
    </div>
  );

  // 🔹 Reusable Card
  const Card = ({ title, desc, onClick, red }) => (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl shadow cursor-pointer transition hover:scale-[1.02] hover:shadow-lg ${
        red
          ? "bg-red-50 border border-red-200"
          : "bg-white"
      }`}
    >
      <h3
        className={`text-lg font-semibold ${
          red ? "text-red-700" : "text-purple-800"
        }`}
      >
        {title}
      </h3>
      <p className={`text-sm mt-1 ${red ? "text-red-600" : "text-gray-600"}`}>
        {desc}
      </p>
    </div>
  );

  // 🔹 Pages (FULL PAGE STYLE)

  const SOS = () => (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold text-red-700 mb-6">
        Emergency Assistance
      </h1>
      <button className="bg-red-600 text-white px-10 py-6 rounded-full text-lg hover:bg-red-700">
        🚨 Trigger Emergency Alert
      </button>
    </div>
  );

  const Contacts = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Trusted Contacts</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        Manage your emergency contacts here.
      </div>
    </div>
  );

  // const Location = () => (
  //   <div>
  //     <h1 className="text-2xl font-bold mb-6">Live Location Tracking</h1>
  //     <div className="bg-white p-6 rounded-xl shadow">
  //       Your real-time location will be shown here.
  //     </div>
  //   </div>
  // );

  const AI = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Smart Monitoring</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        AI is monitoring unusual activity.
      </div>
    </div>
  );

  const Score = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Safety Insights</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        Area safety score: 78/100
      </div>
    </div>
  );

  const Alerts = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        No alerts yet.
      </div>
    </div>
  );

  const Settings = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        Update your profile here.
      </div>
    </div>
  );

  // 🔹 Switch
  const renderContent = () => {
    switch (active) {
      case "sos":
        return <SOS />;
      case "contacts":
        return <Contacts />;
      case "location":
        return <Location />;
      case "ai":
        return <AI />;
      case "score":
        return <Score />;
      case "alerts":
        return <Alerts />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-6 bg-purple-50 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;