import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "🏠" },
  { name: "Emergency SOS", path: "/sos", icon: "🚨" },
  { name: "Contacts", path: "/contacts", icon: "👥" },
  { name: "Location", path: "/location", icon: "📍" },
  { name: "AI Monitoring", path: "/ai-threatdetection", icon: "🤖" },
  { name: "QuickExit", path: "/quick-exit", icon: "🏃" },
  { name: "SafeRoute", path: "/saferoute", icon: "🛡️" },
  { name: "Profile", path: "/profile", icon: "👤" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="hidden lg:flex w-64 shrink-0 bg-white/90 backdrop-blur-lg border-r border-purple-100 overflow-y-auto shadow-sm h-full p-4 space-y-3 font-medium flex-col">
      {navItems.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`p-3 rounded-lg cursor-pointer flex items-center gap-2 transition-all duration-200 ${
            location.pathname === item.path
              ? "bg-gradient-to-r from-pink-100 to-purple-100 text-blue-900 shadow-sm"
              : "hover:bg-gray-50"
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
