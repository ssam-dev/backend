import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, "../../uploads");
const profilePhotosDir = path.join(uploadsDir, "profile-photos");
const certificatesDir = path.join(uploadsDir, "certificates");

[uploadsDir, profilePhotosDir, certificatesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for profile photos
const profilePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePhotosDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer for certificates
const certificatesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, certificatesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf"
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const uploadProfilePhoto = multer({
  storage: profilePhotoStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const uploadCertificates = multer({
  storage: certificatesStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB per file
  }
});

// Upload single profile photo
router.post("/profile-photo", uploadProfilePhoto.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/profile-photos/${req.file.filename}`;
    res.json({
      success: true,
      message: "Profile photo uploaded successfully",
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error("Profile photo upload error:", error);
    res.status(500).json({
      error: "Upload failed",
      details: error.message
    });
  }
});

// Upload multiple certificates
router.post("/certificates", uploadCertificates.array("files", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      url: `/uploads/certificates/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      originalname: file.originalname
    }));

    res.json({
      success: true,
      message: "Certificates uploaded successfully",
      files: uploadedFiles
    });
  } catch (error) {
    console.error("Certificates upload error:", error);
    res.status(500).json({
      error: "Upload failed",
      details: error.message
    });
  }
});

// Delete file endpoint
router.delete("/file", (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const fullPath = path.join(__dirname, "../..", filePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      res.json({
        success: true,
        message: "File deleted successfully"
      });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({
      error: "Deletion failed",
      details: error.message
    });
  }
});

export default router;
