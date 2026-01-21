import SOS from "../models/Sos.js";
import sendAlert from "../utils/sendAlert.js";

export const triggerSOS = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Check if location exists
    if (!lat || !lng) {
      return res.status(400).json({ message: "Location required" });
    }

    // Create SOS entry in DB
    const sos = await SOS.create({
      userId: req.user.id, // comes from auth middleware
      location: { lat, lng },
    });

    // Send alert (currently console log)
    await sendAlert(req.user, lat, lng);

    res.status(201).json({
      message: "SOS triggered successfully",
      sos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
