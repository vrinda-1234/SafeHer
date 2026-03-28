import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // 🔥 REAL USER

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save profile (frontend for now)
  const handleSave = () => {
    setUser(form); // update global user
    setShowModal(false);
  };

  // 🔹 Logout
  const handleLogout = () => {
    setUser(null); // clear user
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
        <h1
          className="text-xl font-bold text-purple-800 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          SafeHer
        </h1>

        {/* Profile Icon */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold cursor-pointer hover:bg-purple-600"
          >
            {getInitial()}
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
              <p className="font-semibold text-purple-800">
                {user?.name || "No Name"}
              </p>

              <p className="text-sm text-gray-500">
                {user?.email || "No Email"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                📞 {user?.phone || "N/A"}
              </p>

              <hr className="my-3" />

              <button
                onClick={() => {
                  setShowModal(true);
                  setOpen(false);
                }}
                className="block w-full text-left text-sm text-gray-700 hover:text-purple-700 mb-2"
              >
                Edit Profile
              </button>

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

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold text-purple-800 mb-4">
              Edit Profile
            </h2>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;