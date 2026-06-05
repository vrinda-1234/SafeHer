import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import socket from "../socket";

const TrackSOS = () => {
  const { id } = useParams();
  const [sos, setSos] = useState(null);

  useEffect(() => {
    const fetchSOS = async () => {
      try {
        const res = await API.get(`/api/sos/${id}`);
        setSos(res.data);
      } catch (err) {
        console.error("Failed to fetch SOS:", err);
      }
    };

    fetchSOS();

    // Connect socket only when tracking page opens
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("✅ CONNECTED:", socket.id);

      socket.emit("joinSOS", id);
      console.log("📍 Joining room:", id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ CONNECT ERROR:", err.message);
    });
    socket.onAny((event, data) => {
      console.log("📡 EVENT RECEIVED:", event, data);
    });
    const handleLocationUpdate = (data) => {
      console.log("📡 SOCKET UPDATE:", data);

      setSos((prev) => ({
        ...prev,
        location: {
          lat: data.lat,
          lng: data.lng,
        },
      }));
    };

    socket.on("locationUpdated", handleLocationUpdate);

    return () => {
      socket.off("locationUpdated", handleLocationUpdate);
      socket.off("connect");
      socket.off("connect_error");

      // Disconnect when leaving tracking page
      socket.disconnect();
    };
  }, [id]);

  if (!sos) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Live Tracking</h1>

      {sos.location && (
        <iframe
          title="Tracking Map"
          width="100%"
          height="400"
          className="rounded-lg"
          src={`https://maps.google.com/maps?q=${sos.location.lat},${sos.location.lng}&z=15&output=embed`}
        />
      )}

      <p className="mt-4 text-gray-700">
        Status: <b>{sos.status}</b>
      </p>
    </div>
  );
};

export default TrackSOS;
