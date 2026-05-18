import SOS from "../models/Sos.js";
import sendAlert from "../utils/sendAlert.js";

// simple in-memory throttle (upgrade to Redis later)
const lastUpdateMap = new Map();

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// helper: distance check (better than raw lat diff)
const isMovementSignificant = (a, b) => {
  if (!a || !b) return true;
  return Math.abs(a.lat - b.lat) + Math.abs(a.lng - b.lng) > 0.0002;
};

export const triggerSOS = async (req, res) => {
  try {
    const { location, message, idempotencyKey } = req.body;

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Location required" });
    }

    // ✅ IDMPOTENCY CHECK FIRST
    if (idempotencyKey) {
      const existing = await SOS.findOne({
        userId: req.user._id,
        idempotencyKey,
      });

      if (existing) {
        return res.status(200).json({
          message: "SOS already exists (idempotent)",
          sosId: existing._id,
          trackingLink: `${REACT_APP_API_URL}/track/${existing._id}`,
        });
      }
    }

    // ✅ ACTIVE SOS CHECK
    const active = await SOS.findOne({
      userId: req.user._id,
      status: "ACTIVE",
    });

    if (active) {
      return res.status(409).json({
        message: "You already have an active SOS",
        sosId: active._id,
        trackingLink: `${REACT_APP_API_URL}/track/${active._id}`,
      });
    }

    // ✅ CREATE SOS (race-safe due to DB index)
    const sos = await SOS.create({
      userId: req.user._id,
      location,
      message,
      status: "ACTIVE",
      idempotencyKey,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h auto expiry
    });

    // async alert
    sendAlert(req.user, location.lat, location.lng).catch(console.log);

    return res.status(201).json({
      message: "SOS triggered",
      sosId: sos._id,
      trackingLink: `${REACT_APP_API_URL}/track/${sos._id}`,
    });
  } catch (error) {
    console.error("SOS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMySOS = async (req, res) => {
  const sosList = await SOS.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(sosList);
};

export const resolveSOS = async (req, res) => {
  const sos = await SOS.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!sos) {
    return res.status(404).json({ message: "SOS not found" });
  }

  sos.status = "RESOLVED";
  await sos.save();

  res.json({ message: "SOS resolved" });
};

export const getSOSById = async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);

    if (!sos) {
      return res.status(404).json({ message: "SOS not found" });
    }

    res.json(sos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { sosId, lat, lng } = req.body;

    if (!sosId || lat == null || lng == null) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // ✅ throttle updates per user
    const now = Date.now();
    const last = lastUpdateMap.get(sosId) || 0;

    if (now - last < 2000) {
      return res.status(200).json({ message: "Skipped (throttled)" });
    }

    lastUpdateMap.set(sosId, now);

    const sos = await SOS.findOne({
      _id: sosId,
      userId: req.user._id,
      status: "ACTIVE",
    });

    if (!sos) {
      return res.status(404).json({ message: "Active SOS not found" });
    }

    // optional: avoid useless updates
    if (
      !isMovementSignificant(sos.location, { lat, lng })
    ) {
      return res.status(200).json({ message: "No significant movement" });
    }

    sos.location = { lat, lng };
    sos.locationHistory.push({ lat, lng });

    await sos.save();

    res.json({ message: "Location updated", sos });
  } catch (error) {
    res.status(500).json({ message: "Location update failed" });
  }
};