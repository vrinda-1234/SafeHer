import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    // optional message from AI or user
    message: {
      type: String,
      maxlength: 300,
    },

    // 🧠 CORE STATE SYSTEM
    status: {
      type: String,
      enum: ["ACTIVE", "RESOLVED"],
      default: "ACTIVE",
      index: true,
    },

    // 📍 tracking history (for live movement)
    locationHistory: [
      {
        lat: Number,
        lng: Number,
      },
    ],
  },
  { timestamps: true }
);

// 🔥 IMPORTANT INDEX (prevents multiple ACTIVE SOS per user)
sosSchema.index({ userId: 1, status: 1 });

export default mongoose.model("SOS", sosSchema);