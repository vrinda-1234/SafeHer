import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// GET PROFILE
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// UPDATE CONTACTS
router.put("/contacts", protect, async (req, res) => {
  req.user.emergencyContacts = req.body.contacts;
  await req.user.save();
  res.json({ message: "Contacts updated" });
});

export default router;
