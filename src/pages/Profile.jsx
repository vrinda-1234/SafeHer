import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bloodGroup: user?.bloodGroup || "",
    emergencyContact: user?.emergencyContact || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/api/profile", form);

      setUser(res.data);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Profile update failed!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* 👤 PROFILE HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold">
          {form.name ? form.name.charAt(0).toUpperCase() : "?"}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            {form.name || "Your Name"}
          </h2>
          <p className="text-gray-600">{form.email}</p>
          <p className="text-gray-600">📞 {form.phone || "N/A"}</p>
        </div>
      </div>

      {/* ✏️ BASIC INFO */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded"
          />

          {/* Email visible but not editable */}
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border p-2 rounded"
          />

        </div>
      </div>

      {/* 🚨 EMERGENCY INFO */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-red-600 mb-4">
          Emergency Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            placeholder="Blood Group (e.g. B+)"
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="emergencyContact"
            value={form.emergencyContact}
            onChange={handleChange}
            placeholder="Emergency Contact Number"
            className="border p-2 rounded"
          />

        </div>
      </div>

      {/* 💾 SAVE BUTTON */}
      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default Profile;