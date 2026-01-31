import SOS from "../models/Sos.js";
import sendAlert from "../utils/sendAlert.js";

export const triggerSOS = async (req, res) => {
  try {
    const { location ,message } = req.body;

    // Validate location
    if (!location || location.lat == null || location.lng == null) {
      return res.status(400).json({ message: "Location required" });
    }
    //  Prevent SOS spam (only one ACTIVE)
    const existingSOS = await SOS.findOne({
      userId: req.user._id,
      status: "ACTIVE",
    });
  // Create SOS
    if (existingSOS) {
      return res.status(400).json({
        message: "You already have an active SOS",
      });
    }


    const sos = await SOS.create({
      userId: req.user._id,   // keep consistent with auth
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    });

    await sendAlert(req.user, location.lat, location.lng);

    res.status(201).json({
      message: "SOS triggered successfully",
      sos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMySOS = async (req, res) => {
  const sosList = await SOS.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(sosList);
};

export const resolveSOS = async (req, res) => {
  const sos = await SOS.findById(req.params.id);

  if (!sos) {
    return res.status(404).json({ message: "SOS not found" });
  }

  if (sos.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  sos.status = "RESOLVED";
  await sos.save();

  res.json({ message: "SOS resolved" });
};
