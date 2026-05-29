import rateLimit from "express-rate-limit";

// SOS trigger limiter (prevents spam clicking)
export const sosTriggerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 SOS requests per minute
  message: {
    message: "Too many SOS requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Location update limiter (extra safety layer)
export const locationUpdateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 sec window
  max: 10, // max 10 updates per 10 sec
  message: {
    message: "Too many location updates",
  },
});