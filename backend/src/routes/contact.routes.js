import express from "express";
const router = express.Router();
import {
    addContact,
    getContacts,
    deleteContact,
    updateContact,
  } from "../controllers/contact.controller.js";
  import { protect } from "../middleware/auth.middleware.js";

router.post("/", protect, addContact);
router.get("/", protect, getContacts);
router.delete("/:id", protect, deleteContact);
router.put(
  "/:id",
  protect,
  updateContact
);
export default router;