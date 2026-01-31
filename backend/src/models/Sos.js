import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    message: {
      type: String,
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "RESOLVED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SOS", sosSchema);