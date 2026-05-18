import express from "express";
import axios from "axios";

import {
  saveLocation,
  savePlace,
  getSavedPlaces,
} from "../controllers/location.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ================= EXISTING =================
router.post("/save", protect, saveLocation);
router.post("/save-place", protect, savePlace);
router.get("/places", protect, getSavedPlaces);

// ================= 🆓 NEARBY SAFE PLACES =================
router.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat & lng required" });
  }

  try {
    const query = `
      [out:json];
      (
        node["amenity"="police"](around:2000,${lat},${lng});
        node["amenity"="hospital"](around:2000,${lat},${lng});
      );
      out;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: { "Content-Type": "text/plain" },
      }
    );

    const places = response.data.elements.map((p) => ({
      name: p.tags?.name || "Unnamed Place",
      lat: p.lat,
      lng: p.lon,
      types: [p.tags?.amenity],
    }));

    res.json(places);
  } catch (err) {
    console.error("Overpass Error:", err.message);
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});

export default router;