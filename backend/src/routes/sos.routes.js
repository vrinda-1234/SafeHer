import express from "express";

import {
    triggerSOS,
    getMySOS,
    resolveSOS,
    getSOSById,
    updateLocation
  } from "../controllers/sos.controller.js";
import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

// Trigger SOS (protected route)
router.post("/trigger", protect, triggerSOS);
router.get("/my", protect, getMySOS);
router.get("/:id", getSOSById);
router.put("/:id/resolve", protect, resolveSOS);
router.patch("/update-location", protect, updateLocation);
export default router;
