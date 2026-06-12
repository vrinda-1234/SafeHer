import Trip from "../models/Trip.js";
import SOS from "../models/Sos.js";
export const startTrip = async (req, res) => {
  try {
    const { start, destination } = req.body;

    // Fetch route from OSRM
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    const coords = data.routes[0].geometry.coordinates;

    const routePoints = coords.map(([lng, lat]) => ({
      lat,
      lng,
    }));

    const trip = await Trip.create({
      userId: req.user._id,
      startLocation: start,
      destination,
      routePoints,
      active: true,
    });

    res.json({ trip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const endTrip = async (req, res) => {
  try {
    await Trip.findOneAndUpdate(
      {
        userId: req.user._id,
        active: true,
      },
      {
        active: false,
      }
    );

    const sos = await SOS.findOne({
      userId: req.user._id,
      status: "ACTIVE",
    });

    if (sos) {
      sos.status = "RESOLVED";
      await sos.save();

      const io = req.app.get("io");

      io.to(sos._id.toString()).emit("sosResolved", {
        sosId: sos._id,
        status: "RESOLVED",
      });

      console.log("✅ SOS auto-resolved:", sos._id);
    } else {
      console.log("ℹ️ No active SOS found");
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("End Trip Error:", err);

    res.status(500).json({
      message: "Failed to end trip",
    });
  }
};
export const getActiveTrip = async (req, res) => {
  const trip = await Trip.findOne({
    userId: req.user._id,
    active: true,
  });

  res.json({ trip });
};