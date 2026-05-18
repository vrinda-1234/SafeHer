import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,   // ✅ NEW FIELD
      required: true,
    },
    relation: {
      type: String, // optional (Mother, Friend, etc.)
    },
  },
  { timestamps: true }
);
export default mongoose.model("Contact", contactSchema);