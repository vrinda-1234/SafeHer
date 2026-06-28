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

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-purple-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[64px] flex-shrink-0 transition-all duration-200 border-none outline-none bg-transparent cursor-pointer
              ${
                location.pathname === item.path
                  ? "text-blue-900"
                  : "text-gray-400"
              }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>

            <span
              className={`text-[9px] font-medium whitespace-nowrap leading-tight
                ${
                  location.pathname === item.path
                    ? "text-blue-900"
                    : "text-gray-400"
                }`}
            >
              {item.name}
            </span>

            {location.pathname === item.path && (
              <span className="w-1 h-1 rounded-full bg-pink-500 mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
