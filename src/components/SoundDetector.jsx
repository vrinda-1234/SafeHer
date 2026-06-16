import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { haversine } from "../utils/haversine";

const ML_URL = process.env.REACT_APP_ML_URL;
const AI_TRIGGER_COOLDOWN = 60000;
const SEND_INTERVAL = 3000;
const API_URL = process.env.REACT_APP_API_URL;

const socket = io(`${API_URL}`, {
  withCredentials: true,
  autoConnect: false,
});

// ==========================
// WAKE UP ML SERVER
// Call this once on mount so the server is warm before first /predict
// ==========================
const wakeUpML = async () => {
  try {
    await fetch(`${ML_URL}/`, { method: "GET" });
    console.log("✅ ML server warmed up");
  } catch (err) {
    console.warn("⚠️ ML wake-up ping failed:", err);
  }
};

// ==========================
// FETCH WITH TIMEOUT + RETRY
// ==========================
const fetchWithRetry = async (url, options, timeoutMs = 60000, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      clearTimeout(timer);
      const isLast = attempt === retries;
      if (isLast) throw err;
      console.warn(`Attempt ${attempt + 1} failed, retrying...`);
      await new Promise((r) => setTimeout(r, 2000)); // wait 2s between retries
    }
  }
};

const SoundDetector = () => {
  const [recording, setRecording] = useState(false);
  const [lastStatus, setLastStatus] = useState("Idle");
  const [dangerCount, setDangerCount] = useState(0);
  const [sosActive, setSosActive] = useState(false);
  const [mlReady, setMlReady] = useState(false); // NEW: show warming state

  // Recording
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const activeRef = useRef(false);
  const isRestartingRef = useRef(false);

  // Location
  const locationRef = useRef(null);
  const lastSentLatRef = useRef(null);
  const lastSentLngRef = useRef(null);
  const watchIdRef = useRef(null);

  // Danger detection
  const dangerStreakRef = useRef(0);
  const lastTriggerTimeRef = useRef(0);

  // SOS state
  const activeSosIdRef = useRef(null);
  const sosActiveRef = useRef(false);
  const intervalRef = useRef(null);

  const setSosActiveSync = (val) => {
    sosActiveRef.current = val;
    setSosActive(val);
  };

  // ==========================
  // SYNC SOS ON MOUNT + WAKE ML
  // ==========================
  useEffect(() => {
    socket.connect();

    // Ping ML server immediately so it's warm when user starts monitoring
    wakeUpML().then(() => setMlReady(true));

    const syncSOS = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sos/my`, {
          credentials: "include",
        });
        const data = await res.json();
        const active = data?.find((s) => s.status === "ACTIVE");
        if (!active) return;

        activeSosIdRef.current = active._id;
        setSosActiveSync(true);
        socket.emit("joinSOS", active._id);
        startLiveLocation();
        startLocationInterval(active._id);
        setLastStatus("🚨 Restored ACTIVE SOS");
      } catch (err) {
        console.error("SOS sync failed:", err);
      }
    };

    syncSOS();

    return () => {
      socket.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // ==========================
  // PAGE VISIBILITY
  // ==========================
  useEffect(() => {
    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        sosActiveRef.current &&
        activeSosIdRef.current
      ) {
        sendLocationUpdate(activeSosIdRef.current, true);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // ==========================
  // LOCATION WATCH
  // ==========================
  const startLiveLocation = () => {
    if (watchIdRef.current !== null) return;
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        locationRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      (err) => console.log("GPS error:", err),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
  };

  const stopLiveLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // ==========================
  // SEND LOCATION UPDATE
  // ==========================
  const sendLocationUpdate = async (sosId, force = false) => {
    if (!sosId || !locationRef.current) return;

    const { lat, lng } = locationRef.current;

    if (!force) {
      if (lastSentLatRef.current === null) {
        lastSentLatRef.current = lat;
        lastSentLngRef.current = lng;
      } else {
        const distance = haversine(
          lastSentLatRef.current,
          lastSentLngRef.current,
          lat,
          lng
        );
        if (distance < 15) return;
        lastSentLatRef.current = lat;
        lastSentLngRef.current = lng;
      }
    } else {
      lastSentLatRef.current = lat;
      lastSentLngRef.current = lng;
    }

    try {
      await fetch(`${API_URL}/api/sos/update-location`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sosId, lat, lng }),
      });
    } catch (err) {
      console.error("❌ Location update failed:", err);
    }
  };

  // ==========================
  // LOCATION INTERVAL
  // ==========================
  const startLocationInterval = (sosId) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (sosActiveRef.current) sendLocationUpdate(sosId);
    }, SEND_INTERVAL);
  };

  // ==========================
  // CHECK ACTIVE SOS
  // ==========================
  const checkActiveSOS = async () => {
    const res = await fetch(`${API_URL}/api/sos/my`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.find((s) => s.status === "ACTIVE") || null;
  };

  // ==========================
  // TRIGGER AI SOS
  // ==========================
  const triggerAISOS = async () => {
    if (!locationRef.current) {
      setLastStatus("⏳ Waiting for GPS...");
      return;
    }

    const existing = await checkActiveSOS();
    if (existing) {
      activeSosIdRef.current = existing._id;
      setSosActiveSync(true);
      socket.emit("joinSOS", existing._id);
      startLocationInterval(existing._id);
      startLiveLocation();
      sendLocationUpdate(existing._id, true);
      return;
    }

    const now = Date.now();
    if (now - lastTriggerTimeRef.current < AI_TRIGGER_COOLDOWN) return;
    lastTriggerTimeRef.current = now;

    const res = await fetch(`${API_URL}/api/sos/trigger`, {
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
    setSosActiveSync(true);
    socket.emit("joinSOS", data.sosId);
    startLocationInterval(data.sosId);
    setLastStatus("🚨 AI SOS ACTIVE");
  };

  // ==========================
  // AUDIO CHUNK LOOP
  // ==========================
  const startChunk = (mediaRecorder) => {
    if (!activeRef.current) return;
    chunksRef.current = [];
    mediaRecorder.start();
    setTimeout(() => {
      if (mediaRecorder.state === "recording") mediaRecorder.stop();
    }, 4000);
  };

  // ==========================
  // START MONITORING
  // ==========================
  const startMonitoring = async () => {
    activeRef.current = true;
    startLiveLocation();

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      activeRef.current = false;
      setRecording(false);
      setLastStatus("❌ Mic access denied");
      return;
    }

    setRecording(true);
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (activeRef.current) chunksRef.current.push(e.data);
    };

    // ==========================
    // ONSTOP — FIXED: timeout + retry + better error messages
    // ==========================
    mediaRecorder.onstop = async () => {
      if (!activeRef.current || isRestartingRef.current) return;
      isRestartingRef.current = true;

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });

      // Skip sending if chunk is too small (silence / mic blip)
      if (blob.size < 1000) {
        console.log("Chunk too small, skipping");
        isRestartingRef.current = false;
        if (activeRef.current) startChunk(mediaRecorder);
        return;
      }

      try {
        setLastStatus("🔍 Analyzing...");

        const formData = new FormData();
        formData.append("file", blob, "audio.webm");

        // 60s timeout, 2 retries — handles cold starts on Render free tier
        const res = await fetchWithRetry(
          `${API_URL}/api/ml/predict`,
          { method: "POST", body: formData },
          60000,
          2
        );

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
          dangerStreakRef.current = 0;
          await triggerAISOS();
        } else {
          setLastStatus(data.danger ? "⚠️ Suspicious sound" : "🟢 Normal");
        }

        if (sosActiveRef.current && activeSosIdRef.current) {
          sendLocationUpdate(activeSosIdRef.current);
        }
      } catch (err) {
        console.error("ML prediction failed after retries:", err);
        // Don't say "ML error" for every cold-start — show something friendlier
        if (err.name === "AbortError") {
          setLastStatus("⏳ Server waking up, retrying...");
        } else {
          setLastStatus("⚠️ ML unavailable, retrying...");
        }
      }

      isRestartingRef.current = false;
      if (activeRef.current) startChunk(mediaRecorder);
    };

    startChunk(mediaRecorder);
  };

  // ==========================
  // STOP MONITORING
  // ==========================
  const stopMonitoring = async () => {
    activeRef.current = false;
    setRecording(false);

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());

    stopLiveLocation();
    lastSentLatRef.current = null;
    lastSentLngRef.current = null;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (sosActiveRef.current && activeSosIdRef.current) {
      try {
        await fetch(`${API_URL}/api/sos/${activeSosIdRef.current}/resolve`, {
          method: "PUT",
          credentials: "include",
        });
      } catch (err) {
        console.error("❌ Resolve failed:", err);
      }
      socket.emit("leaveSOS", activeSosIdRef.current);
    }

    setSosActiveSync(false);
    activeSosIdRef.current = null;
    dangerStreakRef.current = 0;
    setDangerCount(0);
    setLastStatus("Stopped");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ML warming banner */}
        {!mlReady && (
          <div style={styles.warmingBanner}>
            ⏳ Warming up AI server, please wait...
          </div>
        )}

        <div
          style={
            recording ? styles.statusCardActive : styles.statusCardInactive
          }
        >
          <div
            style={{
              ...styles.statusDot,
              background: recording ? "#22c55e" : "#ef4444",
            }}
          />
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
          <div style={styles.consoleRow}>
            <span>SOS</span>
            <strong>{sosActive ? "🚨 Active" : "—"}</strong>
          </div>
          <div style={styles.consoleRow}>
            <span>ML Server</span>
            <strong>{mlReady ? "🟢 Ready" : "⏳ Warming..."}</strong>
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
    borderRadius: "24px",
    padding: "32px",
  },
  warmingBanner: {
    background: "#fef9c3",
    border: "1px solid #fde68a",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#92400e",
    textAlign: "center",
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
    flexShrink: 0,
  },
  statusTitle: { margin: 0, fontSize: "16px", fontWeight: "600" },
  statusText: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "14px",
    fontFamily: "'Syne', sans-serif",
  },
  buttonContainer: { textAlign: "center", marginBottom: "25px" },
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
  statValue: { fontWeight: "700", fontSize: "16px", color: "#111827" },
  dangerValue: { fontWeight: "700", fontSize: "28px", color: "#dc2626" },
  console: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    border: "1px solid #e5e7eb",
  },
  consoleTitle: { marginTop: 0, marginBottom: "18px", color: "#1f2937" },
  consoleRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default SoundDetector;
