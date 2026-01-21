import express from "express";
import { uploadPhoto, generateDesign, processImage } from "../controller/aicontroller.js";
import { protect } from "../middleware/authmiddleware.js";
import { uploadAiFields } from "../middleware/upload.js";

const router = express.Router();

// Protected processing endpoint (requires login)
router.post("/process", protect, uploadAiFields, processImage);

// Protected design endpoints
router.post("/upload", protect, uploadPhoto);
router.post("/generate", protect, generateDesign);

export default router;