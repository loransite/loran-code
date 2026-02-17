// backend/routes/designer.js
import express from "express";
import User from "../models/User.js";
import Catalogue from "../models/Catalogue.js";

const router = express.Router();

// GET: All designers
router.get("/", async (req, res) => {
  try {
    const designers = await User.find({ role: "designer" }).select("name avatarUrl");
    const counts = await Catalogue.aggregate([
      { $match: { "designer.id": { $in: designers.map(d => d._id) } } },
      { $group: { _id: "$designer.id", count: { $sum: 1 } } }
    ]);

    const result = designers.map(d => {
      const count = counts.find(c => c._id.toString() === d._id.toString())?.count || 0;
      return {
        id: d._id,
        name: d.name,
        avatarUrl: d.avatarUrl,
        totalDesigns: count,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Single designer (you already have)
router.get("/:id", async (req, res) => {
  // ... your existing code
});

export default router;