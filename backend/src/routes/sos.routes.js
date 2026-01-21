import express from "express";
import { triggerSOS } from "../controllers/sosController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Trigger SOS (protected route)
router.post("/trigger", protect, triggerSOS);

export default router;
