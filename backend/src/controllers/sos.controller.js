import SOS from "../models/Sos.js";
import sendAlert from "../utils/sendAlert.js";

// ==========================
// CONFIG
// ==========================
const LOCATION_THROTTLE_MS = 1000;
const SOS_COOLDOWN_MS = 60 * 1000;

const lastLocationMap = new Map();
const lastSOSMap = new Map();

// ==========================
// CREATE / GET ACTIVE SOS
// ==========================
export const triggerSOS = async (req, res) => {
  try {
    const { location, message } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Location required" });
    }

    const userId = req.user._id;
    const now = Date.now();

    // ==========================
    // COOLDOWN CHECK
    // ==========================
    const lastSOS = lastSOSMap.get(userId.toString()) || 0;

    if (now - lastSOS < SOS_COOLDOWN_MS) {
      return res.status(429).json({
        message: "⚠️ SOS cooldown active. Please wait.",
      });
    }

    // ==========================
    // CHECK EXISTING ACTIVE SOS
    // ==========================
    let sos = await SOS.findOne({
      userId,
      status: "ACTIVE",
    });

    if (sos) {
      const io = req.app.get("io");

      // notify existing SOS reuse
      io.to(sos._id.toString()).emit("sos-active", {
        sosId: sos._id,
        location: sos.location,
        message: "SOS already active",
      });

      return res.status(200).json({
        message: "🚨 SOS already ACTIVE",
        sosId: sos._id,
        status: "ACTIVE",
      });
    }

    // ==========================
    // CREATE NEW SOS
    // ==========================
    sos = await SOS.create({
      userId,
      location,
      message: message || "Emergency SOS triggered",
      status: "ACTIVE",
      locationHistory: [location],
    });

    lastSOSMap.set(userId.toString(), now);

    // ==========================
    // SOCKET EMIT: SOS CREATED
    // ==========================
    const io = req.app.get("io");

    io.to(sos._id.toString()).emit("sos-created", {
      sosId: sos._id,
      location: sos.location,
      message: "🚨 SOS CREATED",
    });

    // ==========================
    // EMAIL ALERT (NON BLOCKING)
    // ==========================
    sendAlert(req.user, location.lat, location.lng, sos._id,io).catch((err) => {
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
// UPDATE LOCATION (REAL TIME)
// ==========================
export const updateLocation = async (req, res) => {
  try {
    const { sosId, lat, lng } = req.body;

    if (!sosId || lat == null || lng == null) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const now = Date.now();
    const last = lastLocationMap.get(sosId) || 0;

    if (now - last < LOCATION_THROTTLE_MS) {
      return res.status(200).json({
        message: "⏳ Throttled",
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
    sos.locationHistory.push({ lat, lng });

    await sos.save();

    lastLocationMap.set(sosId, now);

    // ==========================
    // SOCKET EMIT: LIVE LOCATION
    // ==========================
    const io = req.app.get("io");
    // console.log("🔥 EMITTING LOCATION", {
    // sosId,
    // lat,
    // lng,
    // });

    io.to(sosId).emit("locationUpdated", {
      sosId,
      lat,
      lng,
      timestamp: now,
    });

    return res.json({
      message: "📍 Location updated",
      sosId,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
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

    // ✅ Notify all tracking clients
    const io = req.app.get("io");
    console.log("🚨 EMITTING SOS RESOLVED", sos._id);
    io.to(sos._id.toString()).emit("sosResolved", {
      sosId: sos._id,
      status: "RESOLVED",
    });

    return res.json({
      message: "✅ SOS resolved",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error resolving SOS",
    });
  }
};

// ==========================
// GET MY SOS
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
    res.status(500).json({
      message: "Server error",
    });
  }
};