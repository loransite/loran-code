// controllers/catalogueController.js
import Catalogue from "../model/catalogue.js"; // adjust path/filename if different
import User from "../model/user.js";
import { storeUploadedImage } from '../services/imageStorage.js';

export const createItem = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image required" });

    // Fetch user to get fullName and designerStatus
    const user = await User.findById(req.user.id).select('fullName designerStatus');
    if (!user) return res.status(404).json({ message: "User not found" });

    const image = await storeUploadedImage(req.file, {
      folder: 'catalogue',
      localUrl: `/uploads/${req.file.filename}`,
    });

    const item = new Catalogue({
      title,
      description,
      price: Number(price) || 0,
      category: category || 'general',
      image,
      designer: { id: req.user.id, name: user.fullName || "Unknown" },
      uploadedBy: req.user.id,
      status: user.designerStatus === 'approved' ? 'approved' : 'pending',
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCatalogue = async (req, res) => {
  try {
    // Only show approved items to the public
    const items = await Catalogue.find({ status: 'approved' });
    
    // Ensure all items have designer as object
    const normalized = items.map(item => {
      const itemObj = item.toObject ? item.toObject() : item;
      if (itemObj.designer && typeof itemObj.designer === 'string') {
        // If designer is just an ID string, keep it as is (frontend will handle)
        return itemObj;
      }
      return itemObj;
    });
    
    res.status(200).json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};