import express from "express";
import { uploadPhoto, generateDesign, processImage } from "../controller/aicontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Public processing endpoint (accepts multipart/form-data)
router.post("/process", processImage);

// Protected design endpoints
router.post("/upload", protect, uploadPhoto);
router.post("/generate", protect, generateDesign);

export default router;