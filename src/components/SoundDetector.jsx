import React, { useState, useRef, useEffect } from "react";

const AI_TRIGGER_COOLDOWN = 60000;
const WINDOW_SIZE = 7;
const LOUD_THRESHOLD = 0.12;

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

  const locationRef = useRef({ lat: 0, lng: 0 });
  const chunkTimeoutRef = useRef(null);

  // ==========================
  // SYNC SOS FROM DB
  // ==========================
  useEffect(() => {
    const syncSOS = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/sos/my", {
          credentials: "include",
        });

        const data = await res.json();
        const active = data?.find((s) => s.status === "ACTIVE");

        if (active) {
          activeSosIdRef.current = active._id;
          sosActiveRef.current = true;
          setLastStatus("🚨 Restored ACTIVE SOS from DB");
        }
      } catch (err) {
        console.error("SOS sync failed", err);
      }
    };

    syncSOS();
  }, []);

  // ==========================
  // LOCATION
  // ==========================
  const getLocation = () =>
    new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => resolve({ lat: 0, lng: 0 }),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });

  // ==========================
  // SMOOTHING
  // ==========================
  const updateLoudnessWindow = (value) => {
    const arr = loudHistoryRef.current;

    arr.push(value);
    if (arr.length > WINDOW_SIZE) arr.shift();

    return (
      arr.reduce((acc, v, i) => acc + v * (i + 1), 0) /
      arr.reduce((acc, _, i) => acc + (i + 1), 0)
    );
  };

  // ==========================
  // SOS CHECK
  // ==========================
  const checkActiveSOS = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/sos/my", {
        credentials: "include",
      });

      const data = await res.json();
      const active = data?.find((s) => s.status === "ACTIVE");

      if (active) {
        activeSosIdRef.current = active._id;
        sosActiveRef.current = true;
        return active;
      }

      sosActiveRef.current = false;
      activeSosIdRef.current = null;
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // ==========================
  // UPDATE LOCATION
  // ==========================
  const updateSOSLocation = async () => {
    if (!activeSosIdRef.current || !sosActiveRef.current) return;

    try {
      await fetch("http://localhost:5001/api/sos/update-location", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sosId: activeSosIdRef.current,
          lat: locationRef.current.lat,
          lng: locationRef.current.lng,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // TRIGGER SOS
  // ==========================
  const triggerAISOS = async () => {
    try {
      const existing = await checkActiveSOS();
      if (existing) {
        setLastStatus("🚨 SOS already ACTIVE (DB)");
        console.log("Sos already active");
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
          message: "Danger detected by AI monitoring",
          location: locationRef.current,
          source: "AI",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLastStatus(data.message || "SOS failed");
        return;
      }

      activeSosIdRef.current = data.sosId;
      sosActiveRef.current = true;

      setLastStatus("🚨 AI SOS CREATED");
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // START MONITORING
  // ==========================
  const startMonitoring = async () => {
    try {
      setRecording(true);
      activeRef.current = true;

      locationRef.current = await getLocation();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (activeRef.current) chunksRef.current.push(e.data);
      };

      const startChunk = () => {
        if (!activeRef.current) return;

        chunksRef.current = [];
        mediaRecorder.start();

        chunkTimeoutRef.current = setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 4000);
      };

      mediaRecorder.onstop = async () => {
        if (!activeRef.current || isRestartingRef.current) return;

        isRestartingRef.current = true;

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        console.log("Audio chunk size:", blob.size); // DEBUG

        try {
          const formData = new FormData();
          formData.append("file", blob, "audio.webm");

          const res = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          const isDanger = data.danger === true;

          console.log("ML RESULT:", data);

          if (isDanger) {
            dangerStreakRef.current++;
          } else {
            dangerStreakRef.current = Math.max(0, dangerStreakRef.current - 1);
          }

          setDangerCount(dangerStreakRef.current);

          if (dangerStreakRef.current >= 3) {
            setLastStatus("🚨 DANGER CONFIRMED");

            console.log("Sos is being triggered");

            dangerStreakRef.current = 0;
            setDangerCount(0);

            await triggerAISOS();
          } else {
            setLastStatus(isDanger ? "⚠️ Suspicious sound" : "🟢 Normal");
          }

          if (sosActiveRef.current) {
            updateSOSLocation();
          }
        } catch (err) {
          console.error(err);
        }

        isRestartingRef.current = false;
        if (activeRef.current) startChunk();
      };

      startChunk();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // STOP MONITORING
  // ==========================
  const stopMonitoring = async () => {
    activeRef.current = false;
    setRecording(false);

    try {
      if (activeSosIdRef.current) {
        await fetch(
          `http://localhost:5001/api/sos/${activeSosIdRef.current}/resolve`,
          {
            method: "PUT",
            credentials: "include",
          }
        );
      }
    } catch (err) {
      console.error(err);
    }

    activeSosIdRef.current = null;
    sosActiveRef.current = false;

    setDangerCount(0);
    dangerStreakRef.current = 0;
    loudHistoryRef.current = [];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    setLastStatus("Monitoring stopped");
  };

  // return (
  //   <div style={styles.container}>
  //     <h2 style={styles.title}>🛡️ SafeHer AI Monitoring</h2>

  //     <div style={recording ? styles.statusOn : styles.statusOff}>
  //       {recording ? "🟢 LIVE MONITORING ACTIVE" : "🔴 STOPPED"}
  //     </div>

  //     <div style={{ marginTop: 20 }}>
  //       {!recording ? (
  //         <button style={styles.startBtn} onClick={startMonitoring}>
  //           ▶ Start Monitoring
  //         </button>
  //       ) : (
  //         <button style={styles.stopBtn} onClick={stopMonitoring}>
  //           ⛔ Stop Monitoring
  //         </button>
  //       )}
  //     </div>

  //     <div style={styles.console}>
  //       <h3>📊 Live Console</h3>
  //       <p>
  //         <b>Status:</b> {lastStatus}
  //       </p>
  //       <p>
  //         <b>Danger Score:</b> {dangerCount}
  //       </p>
  //     </div>
  //   </div>
  // );
  return (
  <div style={styles.page}>
    <div style={styles.card}>

      <div
        style={
          recording
            ? styles.statusCardActive
            : styles.statusCardInactive
        }
      >
        <div style={styles.statusDot}></div>

        <div>
          <h3 style={styles.statusTitle}>
            {recording
              ? "LIVE MONITORING ACTIVE"
              : "MONITORING STOPPED"}
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
          <button
            style={styles.startBtn}
            onClick={startMonitoring}
          >
             Start Monitoring
          </button>
        ) : (
          <button
            style={styles.stopBtn}
            onClick={stopMonitoring}
          >
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
          <strong>
            {recording ? "🟢 Active" : "🔴 Inactive"}
          </strong>
        </div>
      </div>
    </div>
  </div>
);
};

// const styles = {
//   container: { textAlign: "center", padding: "40px", fontFamily: "Arial" },
//   title: { fontSize: "24px", marginBottom: "20px" },
//   statusOn: { background: "#d1f7d6", padding: 10, borderRadius: 8 },
//   statusOff: { background: "#ffd6d6", padding: 10, borderRadius: 8 },
//   startBtn: { padding: 10, background: "green", color: "#fff" },
//   stopBtn: { padding: 10, background: "red", color: "#fff" },
//   console: { marginTop: 40, padding: 20, background: "#f4f6f8" },
// };
const styles = {
page: {
  minHeight: "100vh",
  padding: "30px",
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
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "15px",
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
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "25px",
  },

  statCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
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
