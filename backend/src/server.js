import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import sosRoutes from "./routes/sos.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import locationRoutes from "./routes/location.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import tripRoutes from "./routes/trip.routes.js";
/* ================= DB CONNECT ================= */
connectDB();

/* ================= APP INIT ================= */
const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/trip", tripRoutes);
app.get("/", (req, res) => {
  res.send("SafeHer backend running 🚀");
});

/* ================= HTTP SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET.IO SETUP ================= */
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

/* attach io to express (VERY IMPORTANT) */
app.set("io", io);

/* ================= SOCKET EVENTS ================= */
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // ✅ Join SOS room (FIXED naming consistency)
  socket.on("joinSOS", (sosId) => {
    if (!sosId) return;
    socket.join(sosId);
    console.log(`📍 Joined SOS room: ${sosId}`);
  });
  socket.on("leaveSOS", (sosId) => {
    socket.leave(sosId);
    console.log(`🚪 Left SOS room: ${sosId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});