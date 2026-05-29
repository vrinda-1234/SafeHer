import express from "express";
import {
  triggerSOS,
  getMySOS,
  resolveSOS,
  getSOSById,
  updateLocation,
} from "../controllers/sos.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import {
  sosTriggerLimiter,
  locationUpdateLimiter,
} from "../middleware/sosRateLimit.js";

const router = express.Router();

// 🧠 CREATE / UPDATE SOS (MAIN ENTRY)
router.post(
  "/trigger",
  protect,
  sosTriggerLimiter,
  triggerSOS
);

// 📍 GET USER SOS HISTORY
router.get("/my", protect, getMySOS);

// 🔍 GET SOS BY ID
router.get("/:id", protect, getSOSById);

// ✅ RESOLVE SOS
router.put("/:id/resolve", protect, resolveSOS);

// 📍 LOCATION UPDATE (TRACKING)
router.patch(
  "/update-location",
  protect,
  locationUpdateLimiter,
  updateLocation
);

export default router;