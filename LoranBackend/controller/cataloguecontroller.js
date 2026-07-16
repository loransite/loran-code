// controllers/catalogueController.js
import Catalogue from "../model/catalogue.js"; // adjust path/filename if different
import { storeUploadedImage } from '../services/imageStorage.js';

export const createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const image = await storeUploadedImage(req.file, {
      folder: 'catalogue',
      localUrl: `/uploads/${req.user.id}/${req.file.filename}`,
    });

    const item = new Catalogue({
      title,
      description,
      price: 0, // or get from req.body
      image,
      designer: { id: req.user.id, name: req.user.name },
      uploadedBy: req.user.id,
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