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
        const res = await API.get(`/api/sos/public/${id}`);
        setSos(res.data);
      } catch (err) {
        console.error("Failed to fetch SOS:", err);
      }
    };

    fetchSOS();

<<<<<<< HEAD
    // ✅ Connect first, THEN join room inside connect handler
    socket.connect();
=======
    // Connect socket only if not already connected
    if (!socket.connected) {
      socket.connect();
    }
>>>>>>> 44e974b (feat: add fake call functionality and minor route deviation detection updates)

    const handleConnect = () => {
      console.log("✅ CONNECTED:", socket.id);
      socket.emit("joinSOS", id);
<<<<<<< HEAD
    };

    const handleLocationUpdate = (data) => {
      console.log("📡 SOCKET UPDATE:", data);
      setSos((prev) => {
        if (!prev) return prev;
        return { ...prev, location: { lat: data.lat, lng: data.lng } };
=======
      console.log("📍 Joined SOS room:", id);
    };

    const handleLocationUpdate = (data) => {
      console.log("📡 SOCKET UPDATE:", data);

      setSos((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          location: {
            lat: data.lat,
            lng: data.lng,
          },
        };
      });
    };

    const handleResolved = (data) => {
      console.log("✅ SOS RESOLVED:", data);

      setSos((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          status: "RESOLVED",
        };
>>>>>>> 44e974b (feat: add fake call functionality and minor route deviation detection updates)
      });
    };

    socket.on("connect", handleConnect);
<<<<<<< HEAD
    socket.on("connect_error", (err) => console.log("❌ CONNECT ERROR:", err.message));
    socket.on("locationUpdated", handleLocationUpdate);
    const handleResolved = (data) => {
  console.log("✅ SOS RESOLVED", data);

  setSos((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      status: "RESOLVED",
    };
  });
};

socket.on("sosResolved", handleResolved);

    // If already connected when this runs, join immediately
=======
    socket.on("connect_error", (err) =>
      console.log("❌ CONNECT ERROR:", err.message)
    );

    socket.on("locationUpdated", handleLocationUpdate);
    socket.on("sosResolved", handleResolved);

    // If socket already connected, join immediately
>>>>>>> 44e974b (feat: add fake call functionality and minor route deviation detection updates)
    if (socket.connected) {
      socket.emit("joinSOS", id);
    }

    return () => {
<<<<<<< HEAD
      socket.off("connect", handleConnect);
      socket.off("connect_error");
      socket.off("locationUpdated", handleLocationUpdate);
      socket.off("sosResolved", handleResolved);
=======
      // 👇 IMPORTANT: leave room first
      socket.emit("leaveSOS", id);

      socket.off("connect", handleConnect);
      socket.off("locationUpdated", handleLocationUpdate);
      socket.off("sosResolved", handleResolved);
      socket.off("connect_error");

      // Optional: only disconnect if this is dedicated socket usage
>>>>>>> 44e974b (feat: add fake call functionality and minor route deviation detection updates)
      socket.disconnect();
    };
  }, [id]);

  if (!sos) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Live Tracking</h1>

      {sos.location && (
        <iframe
<<<<<<< HEAD
          key={`${sos.location.lat}-${sos.location.lng}`}  // ✅ forces re-render on location change
=======
          key={`${sos.location.lat}-${sos.location.lng}`}
>>>>>>> 44e974b (feat: add fake call functionality and minor route deviation detection updates)
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