import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SOS", sosSchema);