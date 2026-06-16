import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";

const router = express.Router();
const upload = multer();

const HF_URL = "https://dhingravrinda-safeher-ml.hf.space/predict";

router.post("/predict", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: "audio.webm",
      contentType: req.file.mimetype,
    });

    const response = await fetch(HF_URL, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HF returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("ML proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;