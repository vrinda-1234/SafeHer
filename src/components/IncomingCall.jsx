import React, { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff } from "lucide-react";

export default function IncomingCall({ caller, stopRingtone, onClose }) {
  const voiceRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const getVoiceFile = () => {
    if (caller.includes("Mom")) return "/mom-voice.mp3";
    if (caller.includes("Dad")) return "/dad-voice.mp3";
    if (caller.includes("Bro")) return "/bro-voice.mp3";

    return "/generic-voice.mp3";
  };
  useEffect(() => {
    let interval;

    if (connected) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [connected]);

  const answerCall = () => {
    stopRingtone();
    setSeconds(0);
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    setConnected(true);

    voiceRef.current?.play();
  };

  const formatTime = () => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return `${mins}:${secs}`;
  };

  return (
    <>
      <div className="fixed inset-0 font-inter bg-black text-white flex flex-col justify-center items-center z-50">
        {!connected ? (
          <>
            <p className="text-lg font-syne mb-2">📞 Incoming Call</p>

            <h1 className="text-4xl font-bold mb-12">{caller}</h1>

            <div className="flex gap-12">
              <button
                onClick={answerCall}
                className="bg-green-500 font-inter p-5 rounded-full"
              >
                <Phone size={32} />
              </button>

              <button onClick={onClose} className="bg-red-500 font-inter p-5 rounded-full">
                <PhoneOff size={32} />
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-green-400 font-inter text-xl mb-4">Connected</p>

            <h1 className="text-4xl font-inter font-bold mb-4">{caller}</h1>

            <p className="text-2xl font-inter mb-10">{formatTime()}</p>

            <button onClick={onClose} className="bg-red-500 p-5 font-inter rounded-full">
              <PhoneOff size={32} />
            </button>
          </>
        )}
      </div>

      <audio ref={voiceRef} src={getVoiceFile()} />
    </>
  );
}
