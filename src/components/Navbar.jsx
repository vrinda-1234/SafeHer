import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ ADD

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ GET FROM CONTEXT

  const handleLogout = async () => {
    await logout(); // 🔥 clears cookie + state
    navigate("/login"); // 🔥 redirect
  };

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      {/* Logo / App Name */}
      <h1
        onClick={() => navigate("/dashboard")}
        className="text-xl font-bold text-purple-800 cursor-pointer"
      >
        SafeHer
      </h1>

      {/* Navigation */}
      <div className="flex gap-6 items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-700 hover:text-purple-700"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="text-gray-700 hover:text-purple-700"
        >
          Profile
        </button>

        {/* 🔥 OPTIONAL: show user name */}
        {user && <span className="text-sm text-gray-600">Hi, {user.name}</span>}

        <button
          onClick={handleLogout}
          className="border-2 border-purple-600 text-purple-700 px-4 py-1.5 rounded-lg hover:bg-purple-50 transition font-medium"
        >
          Logout
        </button>
        <button
          onClick={() => navigate("/contacts")}
          className="text-gray-700 hover:text-purple-700"
        >
          Contacts
        </button>
      </div>
    </div>
  );
};

export default Navbar;
