import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-900">
              Welcome to SafeHer
            </h1>
            <p className="text-gray-600 mt-1">Choose an action to stay safe.</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency SOS */}
            <div
              onClick={() => navigate("/sos")}
              className="bg-red-50 border border-red-200 p-6 rounded-xl shadow
                         hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-red-700">
                🚨 Emergency SOS
              </h3>
              <p className="text-sm text-red-600 mt-1">
                Send instant alert to trusted contacts
              </p>
            </div>

            {/* Live Location */}
            <div
              onClick={() => navigate("/location")}
              className="bg-white p-6 rounded-xl shadow
                         hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-purple-800">
                📍 Live Location
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Share your live location securely
              </p>
            </div>

            {/* AI Threat Detection */}
            <div
              onClick={() => navigate("/ai")}
              className="bg-white p-6 rounded-xl shadow
                         hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-purple-800">
                🤖 AI Threat Detection
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Detect abnormal activity automatically
              </p>
            </div>

            {/* Profile */}
            <div
              onClick={() => navigate("/profile")}
              className="bg-white p-6 rounded-xl shadow
                         hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-purple-800">
                👤 Profile
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                View and edit your profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
