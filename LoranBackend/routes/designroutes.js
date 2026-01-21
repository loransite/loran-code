// routes/designroutes.js
import express from "express";
import multer from "multer";
import { protect } from "../middleware/authmiddleware.js";
import DesignModel from "../model/design.js";
import User from "../model/user.js";
import Catalogue from "../model/catalogue.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// GET: designs for the logged-in designer
router.get('/mine', protect, async (req, res) => {
  try {
    const items = await Catalogue.find({ 'designer.id': req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching designer catalogue items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove the trailing space after '/designer'
router.post("/designer", protect, upload.single("file"), async (req, res) => {
  try {
    console.log("POST /api/designs/designer hit - user:", req.user?.id, "file:", req.file?.filename);
    const { title, price, description, category } = req.body;
    // fetch user to get full name
    const user = await User.findById(req.user.id).select("fullName");
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newDesign = new DesignModel({
      title,
      price: parseFloat(price) || 0,
      description,
      category,
      imageUrl,
      designer: req.user.id,
    });

    await newDesign.save();

    // also create catalogue entry so frontend /api/catalogue shows it
    const catalogueItem = new Catalogue({
      title,
      description,
      price: Number(price) || 0,
      image: imageUrl,
      designer: { id: req.user.id, name: user?.fullName || "Unknown" },
    });
    await catalogueItem.save();

    res.status(201).json({ design: newDesign, catalogue: catalogueItem });
  } catch (error) {
    console.error("Error creating design:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Allow posting to root so frontend can POST to /api/designs
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    console.log("POST /api/designs hit - user:", req.user?.id, "file:", req.file?.filename);
    const { title, price, description, category } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image required" });
    // fetch user fullName
    const user = await User.findById(req.user.id).select("fullName");
    const imageUrl = `/uploads/${req.file.filename}`;

    const newDesign = new DesignModel({
      title,
      price: parseFloat(price) || 0,
      description,
      category,
      imageUrl,
      designer: req.user.id,
    });

    await newDesign.save();

    const catalogueItem = new Catalogue({
      title,
      description,
      price: Number(price) || 0,
      image: imageUrl,
      designer: { id: req.user.id, name: user?.fullName || "Unknown" },
    });
    await catalogueItem.save();

    res.status(201).json({ message: "Design created", design: newDesign, catalogue: catalogueItem });
  } catch (error) {
    console.error("Error creating design:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
