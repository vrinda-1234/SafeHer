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

    message: {
      type: String,
      maxlength: 300,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "RESOLVED"],
      default: "ACTIVE",
      index: true,
    },

    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

sosSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "ACTIVE" } }
);
sosSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true, sparse: true }
);
export default mongoose.model("SOS", sosSchema);