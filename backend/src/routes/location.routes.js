import express from "express";
import axios from "axios";

import {
  saveLocation,
  savePlace,
  getSavedPlaces,
  updatePlace,
  deletePlace,
} from "../controllers/location.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ================= EXISTING =================
router.post("/save", protect, saveLocation);
router.post("/save-place", protect, savePlace);
router.get("/places", protect, getSavedPlaces);
router.put(
  "/places/:id",
  protect,
  updatePlace
);

router.delete(
  "/places/:id",
  protect,
  deletePlace
);
// ================= 🆓 NEARBY SAFE PLACES =================
const nearbyCache = new Map(); // 🧠 simple in-memory cache

router.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat & lng required" });
  }

  try {
    // 🧠 create cache key (rounded to reduce duplicate calls)
    const key = `${Math.round(lat * 100)}_${Math.round(lng * 100)}`;

    // ⚡ STEP 1: check cache first
    if (nearbyCache.has(key)) {
      return res.json(nearbyCache.get(key));
    }

    // 🌍 STEP 2: Overpass query (reduced radius = more stable)
    const query = `
[out:json][timeout:25];
(
  node["amenity"="police"](around:3000,${lat},${lng});
  node["amenity"="hospital"](around:3000,${lat},${lng});
);
out body;
`;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: {
          "Content-Type": "text/plain",
          "User-Agent": "SafeHer/1.0",
        },
        timeout: 15000,
      }
    );

    // 🧾 STEP 3: format response
    const places = (response.data.elements || []).map((p) => ({
      name: p.tags?.name || "Unnamed Place",
      lat: p.lat,
      lng: p.lon,
      types: [p.tags?.amenity],
    }));

    // 💾 STEP 4: store in cache
    nearbyCache.set(key, places);

    // optional: auto-clear cache after 10 minutes
    setTimeout(() => {
      nearbyCache.delete(key);
    }, 10 * 60 * 1000);

    return res.json(places);
  } catch (err) {
    console.error(
      "Overpass Error:",
      err.response?.status,
      err.response?.data || err.message
    );

    // 🛑 fallback safe response
    return res.json([]);
  }
});

export default router;