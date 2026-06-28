import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";
const Profile = () => {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bloodGroup: user?.bloodGroup || "",
    emergencyContact: user?.emergencyContact || "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await API.put("/api/profile/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password changed successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/api/profile", form);

      setUser(res.data);

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Profile update failed!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* PROFILE HEADER */}
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
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-6 py-2 border bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          Change Password
        </button>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-blue-900 mb-5">
              Change Password
            </h2>

            <div className="space-y-4">
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
