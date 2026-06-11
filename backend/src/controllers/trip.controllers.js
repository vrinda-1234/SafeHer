import Trip from "../models/Trip.js";

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
    await Trip.findOneAndUpdate(
      { userId: req.user._id, active: true },
      { active: false }
    );
  
    res.json({ success: true });
  };
  export const getActiveTrip = async (req, res) => {
    const trip = await Trip.findOne({
      userId: req.user._id,
      active: true,
    });
  
    res.json({ trip });
  };