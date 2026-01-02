import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import membersRouter from "./routes/members.js";
import trainersRouter from "./routes/trainers.js";
import equipmentRouter from "./routes/equipment.js";
import uploadsRouter from "./routes/uploads.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet()); // Add security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// Logging
app.use(morgan("combined"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Create uploads directory structure if it doesn't exist
const uploadsPath = path.join(__dirname, "../uploads");
const equipmentPath = path.join(uploadsPath, "equipment");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(equipmentPath)) {
  fs.mkdirSync(equipmentPath, { recursive: true });
}

// Serve static files for uploads with proper MIME types
app.use("/uploads", express.static(path.join(__dirname, "../uploads"), {
  setHeaders: (res, path) => {
    // Set proper content-type for images
    if (path.endsWith('.png')) res.set('Content-Type', 'image/png');
    else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) res.set('Content-Type', 'image/jpeg');
    else if (path.endsWith('.webp')) res.set('Content-Type', 'image/webp');
    else if (path.endsWith('.gif')) res.set('Content-Type', 'image/gif');
    else if (path.endsWith('.pdf')) res.set('Content-Type', 'application/pdf');
  }
}));

// Swagger API Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: "/api/docs/swagger.json",
  }
}));
// API Routes
app.use("/api/members", membersRouter);
app.use("/api/trainers", trainersRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/upload", uploadsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "GMS API is running",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Start server regardless of MongoDB connection
const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});

// Prevent server from closing
server.keepAliveTimeout = 65000;
server.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

// Connect to MongoDB but don't block server startup
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGODB_URI not configured");
}
