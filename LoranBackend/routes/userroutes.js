import express from "express";
import multer from "multer";
import userController from "../controller/usercontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Configure multer for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  }
});

// Get own profile (protected)
router.get("/profile", protect, userController.getProfile);

// Update profile with picture (protected)
router.put(
  "/profile",
  protect,
  upload.single("profilePicture"),
  userController.updateProfile
);

// Get public profile (anyone can view)
router.get("/:userId", userController.getPublicProfile);

export default router;
