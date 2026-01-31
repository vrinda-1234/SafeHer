import express from "express";
import {
    triggerSOS,
    getMySOS,
    resolveSOS,
  } from "../controllers/sos.controller.js";
import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

// Trigger SOS (protected route)
router.post("/trigger", protect, triggerSOS);
router.get("/my", protect, getMySOS);
router.put("/:id/resolve", protect, resolveSOS);
export default router;
