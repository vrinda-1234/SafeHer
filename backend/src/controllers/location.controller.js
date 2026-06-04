import Location from "../models/Location.js";
import SavedLocation from "../models/SavedLocation.js";

// 📍 Save live location
export const saveLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const location = await Location.create({
      userId:req.user._id,
      latitude,
      longitude,
    });

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Save place (IMPORTANT CHANGE 🔥)
export const savePlace = async (req, res) => {
  try {
    const { label, latitude, longitude } = req.body;

    const place = await SavedLocation.create({
      userId:req.user._id,
      label,
      latitude,
      longitude,
    });

    // 🔥 RETURN ALL UPDATED PLACES
    const updatedPlaces = await SavedLocation.find({
      userId:req.user._id,
    });

    res.status(201).json(updatedPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get places
export const getSavedPlaces = async (req, res) => {
  try {
    const places = await SavedLocation.find({
      userId:req.user._id,
    });

    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deletePlace = async (
  req,
  res
) => {
  try {

    const place =
      await SavedLocation.findOne({
        _id:req.params.id,
        userId:req.user._id,
      });

    if(!place){
      return res.status(404).json({
        message:"Place not found",
      });
    }

    await place.deleteOne();

    res.json({
      message:"Place deleted",
    });

  } catch(err){
    res.status(500).json({
      message:err.message,
    });
  }
};
export const updatePlace = async (
  req,
  res
) => {
  try {

    const place =
      await SavedLocation.findOne({
        _id:req.params.id,
        userId:req.user._id,
      });

    if(!place){
      return res.status(404).json({
        message:"Place not found",
      });
    }

    place.label =
      req.body.label || place.label;

    place.latitude =
      req.body.latitude || place.latitude;

    place.longitude =
      req.body.longitude || place.longitude;

    await place.save();

    res.json(place);

  } catch(err){
    res.status(500).json({
      message:err.message,
    });
  }
};