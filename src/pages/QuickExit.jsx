import React, { useState, useEffect, useRef } from "react";
import IncomingCall from "../components/IncomingCall";
import toast from "react-hot-toast";
const callers = ["Dad 👨", "Mom ❤️", "Bro 😊", "Rohan"];

export default function QuickExit() {
  const [delay, setDelay] = useState(30);
  const [caller, setCaller] = useState(callers[0]);
  const [customName, setCustomName] = useState("");
  const [showCall, setShowCall] = useState(false);
  const [incomingCaller, setIncomingCaller] = useState("");
  const audioRef = useRef(null);

  const scheduleCall = () => {
    const callerName = customName.trim() || caller;
    toast.success(
      `📞 Exit call scheduled in ${
        delay === 0
          ? "a few seconds"
          : delay === 60
          ? "1 minute"
          : delay === 300
          ? "5 minutes"
          : `${delay} seconds`
      }`
    );

    setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500, 300, 500, 300, 500]);
      }

      if (audioRef.current) {
        console.log(audioRef.current);
        audioRef.current.play().catch(() => {});
      }

      setIncomingCaller(callerName);
      setShowCall(true);
    }, delay * 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2">🚪 Quick Exit</h1>

        <p className="text-gray-600 mb-6">
          Get a realistic incoming call to leave an uncomfortable situation.
        </p>

        <label className="block mb-2 font-medium">Choose Caller</label>

        <select
          value={caller}
          onChange={(e) => setCaller(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          {callers.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Custom Caller Name</label>

        <input
          placeholder="HR Manager, Sister..."
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">Call After</label>

        <select
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full border p-3 rounded-lg mb-6"
        >
          <option value={0}>Now</option>
          <option value={30}>30 Seconds</option>
          <option value={60}>1 Minute</option>
          <option value={300}>5 Minutes</option>
        </select>

        <button
          onClick={scheduleCall}
          className="w-full bg-pink-600 text-white py-3 rounded-lg"
        >
          Schedule Exit Call
        </button>
      </div>

      <audio ref={audioRef} src="/ringtone.mp3" loop />
      {showCall && (
        <IncomingCall
          caller={incomingCaller}
          stopRingtone={() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          }}
          onClose={() => {
            setShowCall(false);

            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          }}
        />
      )}
    </div>
  );
}
