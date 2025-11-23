import express from "express"; 
import { uploadPhoto, generateDesign } from "../controller/aicontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/upload", protect, uploadPhoto);
router.post("/generate", protect, generateDesign);

export default router;