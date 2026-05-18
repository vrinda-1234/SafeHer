import React, { useState, useRef } from "react";

const SoundDetector = () => {
  const [recording, setRecording] = useState(false);
  const [lastStatus, setLastStatus] = useState("Idle");

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const activeRef = useRef(false);

  const dangerCountRef = useRef(0);
  const lastDangerTimeRef = useRef(0);

  // 📍 REAL LOCATION STORE
  const locationRef = useRef({ lat: null, lng: null });

  const startMonitoring = async () => {
    setRecording(true);
    activeRef.current = true;
    setLastStatus("Initializing microphone & location...");

    // 📍 GET REAL LOCATION
    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationRef.current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("📍 Location fetched:", locationRef.current);
      },
      (error) => {
        console.error("Location error:", error);
      },
      {
        enableHighAccuracy: true,
      }
    );

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];

      const formData = new FormData();
      formData.append("file", blob, "audio.webm");

      try {
        setLastStatus("Analyzing audio...");

        const res = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        const loudness = data.loudness || 0;
        const isLoudEnough = loudness > 0.08;

        const now = Date.now();
        const cooldownPassed = now - lastDangerTimeRef.current > 20000;

        if (isLoudEnough) {
          dangerCountRef.current += 1;
          setLastStatus(`⚠️ Suspicious sound (${dangerCountRef.current})`);
        } else {
          dangerCountRef.current = 0;
          setLastStatus("🟢 Normal environment");
        }

        if (dangerCountRef.current >= 2 && cooldownPassed) {
          setLastStatus("🚨 DANGER CONFIRMED");

          lastDangerTimeRef.current = now;
          dangerCountRef.current = 0;

          await fetch("http://localhost:5001/api/sos/trigger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              message: "Danger detected",
              location: locationRef.current, // ✅ FIXED HERE
            }),
          });

          setLastStatus("📩 Alert sent");
        }
      } catch (err) {
        setLastStatus("❌ Error processing audio");
      }

      if (activeRef.current) {
        startChunk();
      }
    };

    const startChunk = () => {
      if (!activeRef.current) return;

      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 4000);
    };

    startChunk();
  };

  const stopMonitoring = () => {
    activeRef.current = false;
    setRecording(false);
    setLastStatus("Monitoring stopped");

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛡️ SafeHer AI Monitoring</h2>

      <div style={recording ? styles.statusOn : styles.statusOff}>
        {recording ? "🟢 LIVE MONITORING ACTIVE" : "🔴 MONITORING STOPPED"}
      </div>

      {recording && (
        <p style={styles.listening}>🎤 Listening for distress sounds...</p>
      )}

      <div style={{ marginTop: 20 }}>
        {!recording ? (
          <button style={styles.startBtn} onClick={startMonitoring}>
            ▶ Start Monitoring
          </button>
        ) : (
          <button style={styles.stopBtn} onClick={stopMonitoring}>
            ⛔ Stop Monitoring
          </button>
        )}
      </div>

      {/* 🔥 CONSOLE (UNCHANGED UI) */}
      <div style={styles.console}>
        <h3 style={styles.consoleTitle}>📊 Live Monitoring Console</h3>

        <p style={styles.text}>
          <b>Status:</b> {lastStatus}
        </p>
        <p style={styles.text}>
          <b>Danger Count:</b> {dangerCountRef.current}
        </p>
        <p style={styles.text}>
          <b>System:</b> {recording ? "Active" : "Idle"}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    fontFamily: "Arial",
  },

  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },

  statusOn: {
    backgroundColor: "#d1f7d6",
    color: "#1b7f2a",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    display: "inline-block",
  },

  statusOff: {
    backgroundColor: "#ffd6d6",
    color: "#b30000",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    display: "inline-block",
  },

  listening: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555",
  },

  startBtn: {
    padding: "10px 20px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  stopBtn: {
    padding: "10px 20px",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  console: {
    marginTop: "40px",
    width: "100%",
    backgroundColor: "#f4f6f8",
    color: "#1a1a1a",
    padding: "25px",
    textAlign: "left",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  consoleTitle: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#333",
  },

  text: {
    fontSize: "16px",
    margin: "8px 0",
  },
};

export default SoundDetector;
