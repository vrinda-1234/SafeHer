import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Location from "../pages/Location";
import Profile from "../pages/Profile";
import EmergencySOS from "./EmergencySOS";
import Contacts from "./Contacts";
import AIThreatDetection from "./AIThreatDetection";
import Settings from "./Settings";
import SafeRoute from "./SafeRoute";
import QuickExit from "./QuickExit";

const navItems = [
  { name: "Dashboard",     key: "dashboard",  icon: "🏠" },
  { name: "Emergency SOS", key: "sos",         icon: "🚨" },
  { name: "Contacts",      key: "contacts",    icon: "👥" },
  { name: "Location",      key: "location",    icon: "📍" },
  { name: "AI Monitoring", key: "ai",          icon: "🤖" },
  { name: "QuickExit",     key: "quick-exit",  icon: "🏃" },
  { name: "SafeRoute",     key: "route",        icon: "🛡️" },
  { name: "Settings",      key: "settings",    icon: "⚙️" },
];

const Dashboard = () => {
  const [active, setActive] = useState("dashboard");

  /* ── Sidebar (desktop only) ── */
  const Sidebar = () => (
    <div className="hidden lg:flex w-64 shrink-0 bg-white/90 backdrop-blur-lg border-r border-purple-100 overflow-y-auto shadow-sm h-full p-4 space-y-3 font-medium flex-col">
      {navItems.map((item) => (
        <div
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`p-3 rounded-lg cursor-pointer flex items-center gap-2 ${
            active === item.key
              ? "bg-gradient-to-r from-pink-100 to-purple-100 text-blue-900 shadow-sm"
              : "hover:bg-gray-50"
          }`}
        >
          {item.icon} {item.name}
        </div>
      ))}
    </div>
  );

  /* ── Bottom nav (mobile only) ── */
  /* Show first 5 items; rest accessible via "More" — but we have 8, so show all via scroll */
  const BottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-purple-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[64px] flex-shrink-0 transition-all duration-200 border-none outline-none bg-transparent cursor-pointer
              ${active === item.key ? "text-blue-900" : "text-gray-400"}`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className={`text-[9px] font-medium whitespace-nowrap leading-tight
              ${active === item.key ? "text-blue-900" : "text-gray-400"}`}>
              {item.name}
            </span>
            {active === item.key && (
              <span className="w-1 h-1 rounded-full bg-pink-500 mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  /* ── HOME ── */
  const Home = () => (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-blue-900"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Welcome to SafeHer
        </h1>
        <p className="text-gray-600 mt-1">Choose an action to stay safe.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

  /* ── Card ── */
  const Card = ({ title, desc, onClick, red }) => (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <h3 className={`text-lg font-semibold ${red ? "text-red-700" : "text-blue-800"}`}>
        {title}
      </h3>
      <p className={`text-sm mt-1 ${red ? "text-red-600" : "text-gray-600"}`}>
        {desc}
      </p>
    </div>
  );

  const Alerts = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="bg-white p-6 rounded-xl shadow">No alerts yet.</div>
    </div>
  );

  /* ── Switch ── */
  const renderContent = () => {
    switch (active) {
      case "sos":        return <EmergencySOS />;
      case "contacts":   return <Contacts />;
      case "location":   return <Location />;
      case "ai":         return <AIThreatDetection />;
      case "quick-exit": return <QuickExit />;
      case "alerts":     return <Alerts />;
      case "settings":   return <Settings />;
      case "profile":    return <Profile />;
      case "route":      return <SafeRoute />;
      default:           return <Home />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content — extra bottom padding on mobile so bottom nav doesn't cover content */}
        <div
          className="flex-1 p-4 sm:p-6 overflow-y-auto pb-24 lg:pb-6"
          style={{
            background: "linear-gradient(135deg,#FFF5F8 0%,#FAFAFA 45%,#F5F0FF 100%)"
          }}
        >
          {renderContent()}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
