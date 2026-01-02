import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Equipment from "../models/Equipment.js";

const router = express.Router();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads - save to parent/uploads/equipment
const uploadDir = path.join(__dirname, "../../uploads/equipment");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

// Allow JSON (no file) or multipart (with optional image)
const optionalUpload = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.startsWith("multipart/form-data")) {
    upload.single("image")(req, res, next);
  } else {
    next();
  }
};

// Cast incoming body values to proper types
const normalizeFields = (raw = {}) => {
  const cleaned = { ...raw };

  const numberFields = ["purchase_price", "quantity"];
  numberFields.forEach((field) => {
    if (cleaned[field] === "" || cleaned[field] === undefined || cleaned[field] === null || cleaned[field] === "null") {
      delete cleaned[field];
    } else if (!Number.isNaN(Number(cleaned[field]))) {
      cleaned[field] = Number(cleaned[field]);
    }
  });

  const dateFields = [
    "purchase_date",
    "warranty_end_date",
    "last_maintenance_date",
    "next_maintenance_date"
  ];
  dateFields.forEach((field) => {
    if (cleaned[field] === "" || cleaned[field] === undefined || cleaned[field] === null || cleaned[field] === "null") {
      delete cleaned[field];
    }
  });

  return cleaned;
};

// GET /api/equipment
router.get("/", async (req, res) => {
  try {
    const filters = {};
    const { category, condition, status } = req.query;
    if (category) filters.category = category;
    if (condition) filters.condition = condition;
    if (status) filters.status = status;
    const limit = Number(req.query.limit) || 0;
    const offset = Number(req.query.offset) || 0;

    const query = Equipment.find(filters)
      .sort({ createdAt: -1 })
      .skip(offset);

    if (limit > 0) {
      query.limit(limit);
    }

    const items = await query.exec();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/equipment/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/equipment with optional file upload
router.post("/", optionalUpload, async (req, res) => {
  try {
    const equipmentData = normalizeFields(req.body);
    
    // Add image path if file was uploaded
    if (req.file) {
      console.log('File uploaded:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      });
      equipmentData.image_path = `/uploads/equipment/${req.file.filename}`;
      console.log('Image path stored:', equipmentData.image_path);
    }

    const item = new Equipment(equipmentData);
    await item.save();
    console.log('Equipment saved with image_path:', item.image_path);
    res.status(201).json(item);
  } catch (err) {
    // Delete uploaded file if save fails
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
    console.error('Equipment save error:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/equipment/:id with optional file upload
router.put("/:id", optionalUpload, async (req, res) => {
  try {
    const updateData = normalizeFields(req.body);

    // Add new image path if file was uploaded
    if (req.file) {
      console.log('File uploaded for update:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      });
      // Delete old image if exists
      const oldItem = await Equipment.findById(req.params.id);
      if (oldItem && oldItem.image_path) {
        const oldPath = path.join("uploads/equipment", path.basename(oldItem.image_path));
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      updateData.image_path = `/uploads/equipment/${req.file.filename}`;
      console.log('New image path for update:', updateData.image_path);
    }

    const item = await Equipment.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    if (!item) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ error: "Equipment not found" });
    }
    console.log('Equipment updated with image_path:', item.image_path);
    res.json(item);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error('Error deleting file:', unlinkErr);
    });
    console.error('Equipment update error:', err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/equipment/:id/remove-image
router.delete("/:id/remove-image", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    // Delete image file if exists
    if (equipment.image_path) {
      const imagePath = path.join(__dirname, "../../", equipment.image_path.replace(/^\//, ""));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Update equipment to remove image_path
    equipment.image_path = null;
    await equipment.save();

    res.json({ message: "Image removed successfully", equipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/equipment/:id
router.delete("/:id", async (req, res) => {
  try {
    const item = await Equipment.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    // Delete image file if exists
    if (item.image_path) {
      const imagePath = item.image_path.replace(/^\//, "");
      fs.unlink(imagePath, () => {});
    }

    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;