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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛡️ SafeHer AI Monitoring</h2>

      <div style={recording ? styles.statusOn : styles.statusOff}>
        {recording ? "🟢 LIVE MONITORING ACTIVE" : "🔴 STOPPED"}
      </div>

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

      <div style={styles.console}>
        <h3>📊 Live Console</h3>
        <p>
          <b>Status:</b> {lastStatus}
        </p>
        <p>
          <b>Danger Score:</b> {dangerCount}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "40px", fontFamily: "Arial" },
  title: { fontSize: "24px", marginBottom: "20px" },
  statusOn: { background: "#d1f7d6", padding: 10, borderRadius: 8 },
  statusOff: { background: "#ffd6d6", padding: 10, borderRadius: 8 },
  startBtn: { padding: 10, background: "green", color: "#fff" },
  stopBtn: { padding: 10, background: "red", color: "#fff" },
  console: { marginTop: 40, padding: 20, background: "#f4f6f8" },
};

export default SoundDetector;
