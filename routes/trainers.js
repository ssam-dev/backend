import express from "express";
import Trainer from "../models/Trainer.js";

const router = express.Router();

// GET /api/trainers
router.get("/", async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trainers/:id
router.get("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/trainers
router.post("/", async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.status(201).json(trainer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/trainers/:id
router.put("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.json(trainer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/trainers/:id
router.delete("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.json({ message: "Trainer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;