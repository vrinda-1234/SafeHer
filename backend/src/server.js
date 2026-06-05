// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.routes.js";
// import sosRoutes from "./routes/sos.routes.js";
// import contactRoutes from "./routes/contact.routes.js";
// import cookieParser from "cookie-parser";
// import locationRoutes from "./routes/location.routes.js";
// import profileRoutes from "./routes/profile.routes.js";

// connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000", 
//     credentials: true,              //  allow cookies
//   })
// );
// app.use(cookieParser());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/sos", sosRoutes);
// app.use("/api/contact", contactRoutes);     
// app.use("/api/location", locationRoutes);
// app.use("/api/profile", profileRoutes);
// app.get("/", (req, res) => {
//   res.send("SafeHer backend running 🚀");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );
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

connectDB();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: "http://localhost:3000",
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

app.get("/", (req, res) => {
  res.send("SafeHer backend running 🚀");
});

/* ================= SOCKET SETUP START ================= */

// 1. Create HTTP server (IMPORTANT)
const server = http.createServer(app);

// 2. Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// 3. Attach io to app (so controllers can use it)
app.set("io", io);

/* ================= SOCKET EVENTS ================= */

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // Join SOS room
  socket.on("joinSOS", (sosId) => {
    socket.join(sosId);
    console.log(`📍 Joined SOS room: ${sosId}`);
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