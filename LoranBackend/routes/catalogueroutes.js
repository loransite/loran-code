// LoranBackend/routes/catalogueroutes.js
import express from "express";
import { authDesigner } from "../middleware/authdesigner.js";
import uploadDesigner from "../middleware/upload.js";
import { createItem, getCatalogue } from "../controller/cataloguecontroller.js";
import Catalogue from "../model/catalogue.js";

const router = express.Router();

// GET: All items with search and filters
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, designer, sort } = req.query;
    
    let query = {};
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Filter by designer
    if (designer) {
      query['designer.id'] = designer;
    }
    
    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'name-asc') sortOption = { title: 1 };
    if (sort === 'name-desc') sortOption = { title: -1 };
    
    const items = await Catalogue.find(query).sort(sortOption);
    res.json(items);
  } catch (error) {
    console.error('[CATALOGUE] Fetch error:', error);
    res.status(500).json({ message: 'Failed to load catalogue' });
  }
});

// POST: Upload item (designer only)
router.post("/", authDesigner, uploadDesigner, createItem);

export default router;