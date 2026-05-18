import express from "express";
import {
  triggerSOS,
  getMySOS,
  resolveSOS,
  getSOSById,
  updateLocation,
} from "../controllers/sos.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
//console.log("SOS ROUTES LOADED");
router.post("/trigger", protect, triggerSOS);
router.get("/my", protect, getMySOS);
router.get("/:id", protect, getSOSById);
router.put("/:id/resolve", protect, resolveSOS);
router.patch("/update-location", protect, updateLocation);

export default router;