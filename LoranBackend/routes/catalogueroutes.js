// LoranBackend/routes/catalogueroutes.js
import express from "express";
import { authDesigner } from "../middleware/authdesigner.js";
import uploadDesigner from "../middleware/upload.js";
import { createItem, getCatalogue } from "../controller/cataloguecontroller.js";
import Catalogue from "../model/catalogue.js";

const router = express.Router();

// GET: All items
router.get('/', async (req, res) => {
  const items = await Catalogue.find().sort({ createdAt: -1 });
  res.json(items);
});

// POST: Upload item (designer only)
router.post("/", authDesigner, uploadDesigner, createItem);

export default router;