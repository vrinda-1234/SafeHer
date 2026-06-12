import mongoose from "mongoose";
const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  startLocation: {
    lat: Number,
    lng: Number,
  },

  destination: {
    lat: Number,
    lng: Number,
  },

  routePoints: [
    {
      lat: Number,
      lng: Number,
    },
  ],

  active: {
    type: Boolean,
    default: true,
  },

  startedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Trip", tripSchema);