import express from "express";
import { uploadPhoto, generateDesign, processImage } from "../controller/aicontroller.js";
import { protect } from "../middleware/authmiddleware.js";
import { requireEmailVerification } from "../middleware/emailVerification.js";
import { uploadAiFields } from "../middleware/upload.js";

const router = express.Router();

// Protected processing endpoint (requires login + verified email)
router.post("/process", protect, requireEmailVerification, uploadAiFields, processImage);

// Protected design endpoints
router.post("/upload", protect, requireEmailVerification, uploadPhoto);
router.post("/generate", protect, requireEmailVerification, generateDesign);

export default router;