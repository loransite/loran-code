// routes/designroutes.js
import express from "express";
import multer from "multer";
import { protect } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import DesignModel from "../model/design.js";
import User from "../model/user.js";
import Catalogue from "../model/catalogue.js";
import Order from "../model/order.js";
import { storeUploadedImage } from '../services/imageStorage.js';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// GET: designs for the logged-in designer
router.get('/mine', protect, authorizeRoles("designer"), async (req, res) => {
  try {
    const items = await Catalogue.find({ 'designer.id': req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching designer catalogue items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE: remove a designer's own catalogue item. Items with active orders are
// preserved so existing customer transactions never lose their product record.
router.delete('/:id', protect, authorizeRoles("designer"), async (req, res) => {
  try {
    const item = await Catalogue.findOne({
      _id: req.params.id,
      $or: [
        { uploadedBy: req.user.id },
        { 'designer.id': req.user.id },
      ],
    });

    if (!item) {
      return res.status(404).json({ message: 'Design not found or you do not have permission to delete it.' });
    }

    const activeOrder = await Order.exists({
      catalogueId: item._id,
      status: { $nin: ['completed', 'cancelled'] },
    });
    if (activeOrder) {
      return res.status(409).json({
        message: 'This design has an active order and cannot be deleted. Complete or cancel the order first.',
      });
    }

    await Catalogue.deleteOne({ _id: item._id });

    // Older uploads were mirrored into the legacy Design collection. Remove
    // the matching mirror so it cannot remain visible on the public profile.
    await DesignModel.deleteMany({
      designer: req.user.id,
      title: item.title,
      imageUrl: item.image,
    });

    return res.json({ message: 'Design deleted successfully.' });
  } catch (error) {
    console.error('Error deleting designer catalogue item:', error);
    return res.status(500).json({ message: 'Unable to delete design.' });
  }
});

// Remove the trailing space after '/designer'
router.post("/designer", protect, authorizeRoles("designer"), upload.single("file"), async (req, res) => {
  try {
    console.log("POST /api/designs/designer hit - user:", req.user?.id, "file:", req.file?.filename);
    const { title, price, description, category } = req.body;
    // fetch user to get full name
    const user = await User.findById(req.user.id).select("fullName");
    const imageUrl = req.file
      ? await storeUploadedImage(req.file, {
        folder: 'catalogue',
        localUrl: `/uploads/${req.file.filename}`,
      })
      : null;

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
      category: category || 'general',
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
router.post("/", protect, authorizeRoles("designer"), upload.single("file"), async (req, res) => {
  try {
    console.log("POST /api/designs hit - user:", req.user?.id, "file:", req.file?.filename);
    const { title, price, description, category } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image required" });
    // fetch user fullName
    const user = await User.findById(req.user.id).select("fullName designerStatus");
    const imageUrl = await storeUploadedImage(req.file, {
      folder: 'catalogue',
      localUrl: `/uploads/${req.file.filename}`,
    });

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
      category: category || 'general',
      image: imageUrl,
      designer: { id: req.user.id, name: user?.fullName || "Unknown" },
      uploadedBy: req.user.id,
      status: user?.designerStatus === 'approved' ? 'approved' : 'pending',
    });
    await catalogueItem.save();

    res.status(201).json({ message: "Design created", design: newDesign, catalogue: catalogueItem });
  } catch (error) {
    console.error("Error creating design:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
