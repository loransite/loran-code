import express from 'express';
import multer from 'multer';
import { signup, login, forgotPassword, resetPassword, addRole, switchRole } from '../controller/authcontroller.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Multer config for avatar uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Accept multipart/form-data on signup so users can upload profilePicture
router.post('/signup', upload.single('profilePicture'), signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Add a role to existing user (e.g. Client becoming a Designer)
router.post('/add-role', protect, addRole);

// Switch active role (generates new token)
router.post('/switch-role', protect, switchRole);

export default router;