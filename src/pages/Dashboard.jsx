import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const Card = ({ title, desc, onClick, red }) => (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <h3
        className={`text-lg font-semibold ${
          red ? "text-red-700" : "text-blue-800"
        }`}
      >
        {title}
      </h3>

      <p className={`text-sm mt-1 ${red ? "text-red-600" : "text-gray-600"}`}>
        {desc}
      </p>
    </div>
  );

  return (
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
          onClick={() => navigate("/sos")}
          red
        />

        <Card
          title="📍 Live Location"
          desc="View your live location and nearby safe places in real time"
          onClick={() => navigate("/location")}
        />

        <Card
          title="🤖 AI Threat Detection"
          desc="Detect abnormal activity automatically"
          onClick={() => navigate("/ai-threatdetection")}
        />

        <Card
          title="👤 Profile"
          desc="View and edit your profile"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
