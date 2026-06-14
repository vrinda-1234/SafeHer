import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const AI_TRIGGER_COOLDOWN = 60000;
const SEND_INTERVAL = 3000;
const LOUD_THRESHOLD = 0.12;
const socket = io("http://localhost:5001", {
  withCredentials: true,
  autoConnect: false,
});

const SoundDetector = () => {
  const [recording, setRecording] = useState(false);
  const [lastStatus, setLastStatus] = useState("Idle");
  const [dangerCount, setDangerCount] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const activeRef = useRef(false);
  const isRestartingRef = useRef(false);

  const loudHistoryRef = useRef([]);
  const dangerStreakRef = useRef(0);
  const lastTriggerTimeRef = useRef(0);

  const activeSosIdRef = useRef(null);
  const sosActiveRef = useRef(false);

  const locationRef = useRef(null);
  const chunkTimeoutRef = useRef(null);
  const watchIdRef = useRef(null);

  const intervalRef = useRef(null);

  // ==========================
  // SYNC SOS
  // ==========================
  useEffect(() => {
    socket.connect();
    const syncSOS = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/sos/my", {
          credentials: "include",
        });

        const data = await res.json();
        const active = data?.find((s) => s.status === "ACTIVE");

        if (!active) return;

        activeSosIdRef.current = active._id;
        sosActiveRef.current = true;
        socket.emit("joinSOS", active._id);

        setLastStatus("🚨 Restored ACTIVE SOS");
      } catch (err) {
        console.error(err);
      }
    };

    syncSOS();

    return () => {
      socket.disconnect();
    };
  }, []);

  // ==========================
  // LOCATION
  // ==========================
  const startLiveLocation = () => {
    if (watchIdRef.current !== null) {
      return;
    }

    if (!navigator.geolocation) {
      console.log("❌ Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        locationRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        // console.log(
        //   "📍 LOCATION:",
        //   pos.coords.latitude,
        //   pos.coords.longitude
        // );
      },
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
  };

  const stopLiveLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // ==========================
  // SOCKET LOCATION SEND
  // ==========================
  const updateLocationAPI = async (sosId) => {
    if (!sosId) return;

    if (!locationRef.current) {
      console.log("⏳ Waiting for GPS...");
      return;
    }

    try {
      // console.log("📤 Sending:", {
      //   sosId,
      //   lat: locationRef.current.lat,
      //   lng: locationRef.current.lng,
      // });

      const res = await fetch("http://localhost:5001/api/sos/update-location", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sosId,
          lat: locationRef.current.lat,
          lng: locationRef.current.lng,
        }),
      });

      const data = await res.json();
      // console.log("✅ Location Updated:", data);
    } catch (err) {
      console.error("❌ Location update failed:", err);
    }
  };

  // ==========================
  // SOS CHECK
  // ==========================
  const checkActiveSOS = async () => {
    const res = await fetch("http://localhost:5001/api/sos/my", {
      credentials: "include",
    });

    const data = await res.json();
    return data?.find((s) => s.status === "ACTIVE") || null;
  };

  // ==========================
  // TRIGGER SOS
  // ==========================
  const triggerAISOS = async () => {
    if (!locationRef.current) {
      setLastStatus("⏳ Waiting for GPS...");
      return;
    }
    const existing = await checkActiveSOS();

    if (existing) {
      activeSosIdRef.current = existing._id;
      sosActiveRef.current = true;

      socket.emit("joinSOS", existing._id);
      startAISOSTracking(existing._id);
      return;
    }

    const now = Date.now();
    if (now - lastTriggerTimeRef.current < AI_TRIGGER_COOLDOWN) return;
    lastTriggerTimeRef.current = now;

    const res = await fetch("http://localhost:5001/api/sos/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        message: "AI detected danger",
        location: locationRef.current,
      }),
    });

    const data = await res.json();
    if (!data?.sosId) return;

    activeSosIdRef.current = data.sosId;
    sosActiveRef.current = true;

    socket.emit("joinSOS", data.sosId);

    startAISOSTracking(data.sosId);

    setLastStatus("🚨 AI SOS ACTIVE");
  };

  // ==========================
  // TRACKING
  // ==========================
  const startAISOSTracking = (sosId) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!sosActiveRef.current) return;

      updateLocationAPI(activeSosIdRef.current);
    }, SEND_INTERVAL);
  };

  // ==========================
  // START
  // ==========================
  const startMonitoring = async () => {
    setRecording(true);
    activeRef.current = true;

    startLiveLocation();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      if (activeRef.current) chunksRef.current.push(e.data);
    };

    const startChunk = () => {
      if (!activeRef.current) return;

      chunksRef.current = [];
      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 4000);
    };

    mediaRecorder.onstop = async () => {
      if (!activeRef.current || isRestartingRef.current) return;

      isRestartingRef.current = true;

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      console.log("Audio chunk size:", blob.size);
      const formData = new FormData();
      formData.append("file", blob);

      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("ML RESULT:", data);
      if (data.danger) {
        dangerStreakRef.current++;
      } else {
        dangerStreakRef.current = Math.max(0, dangerStreakRef.current - 1);
      }

      setDangerCount(dangerStreakRef.current);

      if (dangerStreakRef.current >= 3) {
        setLastStatus("🚨 DANGER CONFIRMED");
        console.log("Sos is being triggered");
        dangerStreakRef.current = 0;
        await triggerAISOS();
      } else {
        setLastStatus(data.danger ? "⚠️ Suspicious sound" : "🟢 Normal");
      }

      if (sosActiveRef.current && activeSosIdRef.current) {
        updateLocationAPI(activeSosIdRef.current);
      }

      isRestartingRef.current = false;

      if (activeRef.current) startChunk();
    };

    startChunk();
  };

  // ==========================
  // STOP
  // ==========================
  const stopMonitoring = async () => {
    activeRef.current = false;
    setRecording(false);

    stopLiveLocation();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      if (activeSosIdRef.current) {
        await fetch(
          `http://localhost:5001/api/sos/${activeSosIdRef.current}/resolve`,
          {
            method: "PUT",
            credentials: "include",
          }
        );

        console.log("✅ SOS Resolved");
      }
    } catch (err) {
      console.error("❌ Resolve failed:", err);
    }

    // leave room
    if (activeSosIdRef.current) {
      socket.emit("leaveSOS", activeSosIdRef.current);
    }

    socket.disconnect();

    sosActiveRef.current = false;
    activeSosIdRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    setLastStatus("Stopped");
  };
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div
          style={
            recording ? styles.statusCardActive : styles.statusCardInactive
          }
        >
          <div style={styles.statusDot}></div>

          <div>
            <h3 style={styles.statusTitle}>
              {recording ? "LIVE MONITORING ACTIVE" : "MONITORING STOPPED"}
            </h3>

            <p style={styles.statusText}>
              {recording
                ? "AI is listening for potential danger signals."
                : "Start monitoring to activate AI protection."}
            </p>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          {!recording ? (
            <button style={styles.startBtn} onClick={startMonitoring}>
              Start Monitoring
            </button>
          ) : (
            <button style={styles.stopBtn} onClick={stopMonitoring}>
              ⛔ Stop Monitoring
            </button>
          )}
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Current Status</span>
            <span style={styles.statValue}>{lastStatus}</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Danger Score</span>
            <span style={styles.dangerValue}>{dangerCount}</span>
          </div>
        </div>

        <div style={styles.console}>
          <h3 style={styles.consoleTitle}>📊 Live Console</h3>

          <div style={styles.consoleRow}>
            <span>Status</span>
            <strong>{lastStatus}</strong>
          </div>

          <div style={styles.consoleRow}>
            <span>Danger Score</span>
            <strong>{dangerCount}</strong>
          </div>

          <div style={styles.consoleRow}>
            <span>Monitoring</span>
            <strong>{recording ? "🟢 Active" : "🔴 Inactive"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "'Inter', sans-serif",
  },

  card: {
    width: "100%",
    // background: "#fff",
    borderRadius: "24px",
    padding: "32px",
    // boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
    fontFamily: "'Syne', sans-serif",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "10px",
    fontFamily: "'Syne', sans-serif",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "15px",
    fontFamily: "'Syne', sans-serif",
  },

  statusCardActive: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#ecfdf5",
    border: "1px solid #86efac",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "25px",
    fontFamily: "'Syne', sans-serif",
  },

  statusCardInactive: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "25px",
    fontFamily: "'Syne', sans-serif",
  },

  statusDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  statusTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },

  statusText: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "14px",
    fontFamily: "'Syne', sans-serif",
  },

  buttonContainer: {
    textAlign: "center",
    marginBottom: "25px",
  },

  startBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
  },

  stopBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "25px",
    fontFamily: "'Syne', sans-serif",
  },

  statCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    fontFamily: "'Syne', sans-serif",
  },

  statLabel: {
    display: "block",
    color: "#6b7280",
    marginBottom: "8px",
    fontSize: "14px",
  },

  statValue: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#111827",
  },

  dangerValue: {
    fontWeight: "700",
    fontSize: "28px",
    color: "#dc2626",
  },

  console: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    border: "1px solid #e5e7eb",
  },

  consoleTitle: {
    marginTop: 0,
    marginBottom: "18px",
    color: "#1f2937",
  },

  consoleRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default SoundDetector;
