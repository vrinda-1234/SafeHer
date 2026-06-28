import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assests/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); //  REAL USER

  const [open, setOpen] = useState(false);

  // 🔹 Logout
  const handleLogout = async () => {
    setOpen(false);
    await logout(); // clear user
    navigate("/");
  };

  // 🔹 Get first letter for icon
  const getInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "?";
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="SafeHer Logo" className="h-16 w-auto" />
          </div>
        </div>

        {/* Profile Icon */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-500 text-white font-bold cursor-pointer hover:bg-blue-900"
          >
            {getInitial()}
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
              <p
                onClick={() => {
                  setOpen(false);
                }}
                className="font-semibold font-syne text-blue-800"
              >
                {user?.name || "No Name"}
              </p>

              <p className="text-sm font-inter text-gray-500">
                {user?.email || "No Email"}
              </p>

              <hr className="my-3" />

              <button
                onClick={handleLogout}
                className="block w-full text-left text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
