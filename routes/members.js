import express from "express";
import Member from "../models/Member.js";
import { validateMember } from "../middleware/validation.js";

const router = express.Router();

// GET /api/members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/members/:id
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/members
router.post("/", validateMember, async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/members/:id
router.put("/:id", validateMember, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/members/:id
router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
