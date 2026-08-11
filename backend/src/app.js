require("dotenv").config();

const cors = require("cors");
const express = require("express");
const analyzeRoutes = require("./routes/analyze");
const aiRoutes = require("./routes/ai");
const pdfRoutes = require("./routes/pdf");
const profileRoutes = require("./routes/profile");
const shareRoutes = require("./routes/share");
const verifyToken = require("./middleware/auth");
const rateLimiter = require("./middleware/rateLimiter");
const sanitizeInput = require("./middleware/sanitize");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin(origin, callback) {
    const frontendUrl = process.env.FRONTEND_URL;

    // Allow requests with no origin (like curl or mobile apps)
    // Allow all in non-production, or if FRONTEND_URL is not configured
    if (!origin || process.env.NODE_ENV !== "production" || !frontendUrl) {
      return callback(null, true);
    }

    // Split FRONTEND_URL by comma in case multiple URLs are provided
    const allowedOrigins = frontendUrl.split(',').map(url => url.trim().replace(/\/$/, ""));

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Also allow Vercel preview URLs if the main URL is a Vercel URL
    if (origin.endsWith('.vercel.app') && allowedOrigins.some(url => url.endsWith('.vercel.app'))) {
      return callback(null, true);
    }

    console.error(`CORS Error: Origin ${origin} not allowed. Allowed origins: ${allowedOrigins.join(', ')}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(sanitizeInput);
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("AI Resume Builder Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", verifyToken, analyzeRoutes);
app.use("/api/ai", verifyToken, aiRoutes);
app.use("/api/pdf", verifyToken, pdfRoutes);
app.use("/api/profile", verifyToken, profileRoutes);
app.use("/api/share", verifyToken, shareRoutes);
app.use("/api/public/share", shareRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Uploaded file must be 5MB or smaller." });
  }

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Origin is not allowed by CORS." });
  }

  return res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`AI Resume Backend running on port ${PORT}`);
});

module.exports = app;
