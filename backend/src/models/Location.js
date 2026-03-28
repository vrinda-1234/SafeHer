import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);