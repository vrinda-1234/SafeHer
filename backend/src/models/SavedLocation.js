import mongoose from "mongoose";

const savedLocationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    label: {
      type: String, // Home, College
    },
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

export default mongoose.model("SavedLocation", savedLocationSchema);