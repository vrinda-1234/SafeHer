import SOS from "../models/Sos.js";
import sendAlert from "../utils/sendAlert.js";

// ==========================
// CONFIG (REAL SYSTEM STYLE)
// ==========================
const LOCATION_THROTTLE_MS = 1000;//20000; // 20 sec
const SOS_COOLDOWN_MS = 60 * 1000;   // optional: 1 min anti-spam

const lastLocationMap = new Map();
const lastSOSMap = new Map();

// ==========================
// CREATE / GET ACTIVE SOS
// ==========================
export const triggerSOS = async (req, res) => {
  try {
    // TEMPORARY RESET
   /* await SOS.updateMany(
      { status: "ACTIVE" },
      { $set: { status: "RESOLVED" } }
    );*/

    const { location, message } = req.body;
     console.log(req.user.id);
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Location required" });
    }
    const now = Date.now();

    // ==========================
    // 🔥 COOLDOWN CHECK (ANTI SPAM)
    const userId = req.user._id; // ✅ FIX HERE

    console.log("USER:", userId);
    // ==========================
    const lastSOS = lastSOSMap.get(userId.toString()) || 0;

    if (now - lastSOS < SOS_COOLDOWN_MS) {
      return res.status(429).json({
        message: "⚠️ SOS cooldown active. Please wait before retrying.",
      });
    }

    // ==========================
    // 🔥 CHECK ACTIVE SOS
    // ==========================
    let sos = await SOS.findOne({
      userId,
      status: "ACTIVE",
    });

    // ==========================
    // CASE 1: ACTIVE SOS EXISTS
    // ==========================
    if (sos) {
     console.log("sos exists");
      return res.status(200).json({
        message: "🚨 SOS already ACTIVE (using existing session)",
        sosId: sos._id,
        status: "ACTIVE",
      });

    }
   
    // ==========================
    // CASE 2: CREATE NEW SOS
    // ==========================
    sos = await SOS.create({
      userId,
      location,
      message: message || "Emergency SOS triggered",
      status: "ACTIVE",
      locationHistory: [location],
    });
    //console.log("sos created");
    lastSOSMap.set(userId.toString(), now);

    // ==========================
    // SAFE ALERT (NON BLOCKING)
    // ==========================
    sendAlert(req.user, location.lat, location.lng,sos._id).catch((err) => {
      console.log("Alert error:", err.message);
    });

    return res.status(201).json({
      message: "🚨 SOS CREATED SUCCESSFULLY",
      sosId: sos._id,
      status: "ACTIVE",
    });

  } catch (error) {
    console.error("SOS ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ==========================
// UPDATE LOCATION (REAL-TIME TRACKING)
// ==========================
export const updateLocation = async (req, res) => {
  console.log("📍 UPDATE LOCATION HIT");
  try {
    const { sosId, lat, lng } = req.body;

    if (!sosId || lat == null || lng == null) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const now = Date.now();
    const last = lastLocationMap.get(sosId) || 0;

    // throttle
    if (now - last < LOCATION_THROTTLE_MS) {
      return res.status(200).json({
        message: "⏳ Location update throttled",
      });
    }

    const sos = await SOS.findOne({
      _id: sosId,
      userId: req.user._id,
      status: "ACTIVE",
    });

    if (!sos) {
      return res.status(404).json({
        message: "Active SOS not found",
      });
    }

    // update DB
    sos.location = { lat, lng };

    if (!Array.isArray(sos.locationHistory)) {
      sos.locationHistory = [];
    }

    sos.locationHistory.push({ lat, lng });

    await sos.save();

    lastLocationMap.set(sosId, now);

    // ==========================
    // 🔥 SOCKET REAL-TIME EMIT (NEW PART)
    // ==========================
    const io = req.app.get("io");
    console.log("EMITTING TO ROOM:", sosId);

    io.to(sosId).emit("locationUpdated", {
      sosId,
      lat,
      lng,
      timestamp: now,
    });

    return res.json({
      message: "📍 Location updated + emitted",
      sosId: sos._id,
    });

  } catch (err) {
    console.error("Location update error:", err);
    return res.status(500).json({
      message: "Failed to update location",
    });
  }
};
// ==========================
// RESOLVE SOS
// ==========================
export const resolveSOS = async (req, res) => {
  try {
    const sos = await SOS.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!sos) {
      return res.status(404).json({ message: "SOS not found" });
    }

    sos.status = "RESOLVED";
    await sos.save();

    return res.json({
      message: "✅ SOS resolved successfully",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error resolving SOS",
    });
  }
};

// ==========================
// GET USER SOS HISTORY
// ==========================
export const getMySOS = async (req, res) => {
  try {
    const sosList = await SOS.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(sosList);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch SOS",
    });
  }
};

// ==========================
// GET SOS BY ID
// ==========================
export const getSOSById = async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);

    if (!sos) {
      return res.status(404).json({ message: "SOS not found" });
    }

    res.json(sos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};