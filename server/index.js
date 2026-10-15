import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { testConnection } from "./db.js";
import authRoutes from "./routes/auth.js";
import enquiriesRoutes from "./routes/enquiries.js";
import bookingsRoutes from "./routes/bookings.js";
import contentRoutes from "./routes/content.js";
import dbRoutes from "./routes/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local first, fallback to .env
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5050;

// Trust reverse proxies (e.g. Nginx, Cloudflare, Heroku) for accurate IP detection
app.set("trust proxy", 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiriesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/db", dbRoutes);
app.use("/api", contentRoutes);

// Static frontend serving (Single Server Setup)
const distPath = path.resolve(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Endpoint not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Techneyo API Server is running. Frontend build not found in /dist (run npm run build).");
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: "Internal server error: " + err.message });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT} (http://localhost:${PORT})`);
  const status = await testConnection();
  if (status.connected) {
    console.log("✅ MySQL database connected successfully!");
  } else {
    console.warn("⚠️ MySQL connection note:", status.error);
    console.warn("ℹ️ Update MySQL credentials in .env.local to enable database connectivity.");
  }
});

export default app;
