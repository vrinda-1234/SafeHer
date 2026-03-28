import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";

const TrackSOS = () => {
  const { id } = useParams();
  const [sos, setSos] = useState(null);

  useEffect(() => {
    const fetchSOS = async () => {
      try {
        const res = await API.get(`/api/sos/${id}`);
        setSos(res.data);
      } catch (err) {
        console.log("Error fetching SOS");
      }
    };

    fetchSOS();

    // 🔥 AUTO REFRESH every 5 sec
    const interval = setInterval(fetchSOS, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (!sos) return <p className="text-center mt-10">Loading...</p>;

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
