import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { startTrip, endTrip, getActiveTrip } from "../controllers/trip.controller.js";

const router = express.Router();

router.post("/start", protect, startTrip);
router.post("/end", protect, endTrip);
router.get("/active", protect, getActiveTrip);

export default router;