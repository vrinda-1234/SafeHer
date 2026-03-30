import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import sosRoutes from "./routes/sos.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import cookieParser from "cookie-parser";
import locationRoutes from "./routes/location.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,              //  allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/contact", contactRoutes);     
app.use("/api/location", locationRoutes);
app.get("/", (req, res) => {
  res.send("SafeHer backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
