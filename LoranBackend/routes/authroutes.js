import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { signup, login, forgotPassword, resetPassword, addRole, switchRole, verifyEmail, resendVerification } from '../controller/authcontroller.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Increased from 5 to 10 for better UX
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many authentication attempts, please try again later.' });
  }
});

// Multer config for avatar uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Accept multipart/form-data on signup so users can upload profilePicture
router.post('/signup', authLimiter, upload.single('profilePicture'), signup);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// Email verification
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Add a role to existing user (e.g. Client becoming a Designer)
router.post('/add-role', protect, addRole);

// Switch active role (generates new token)
router.post('/switch-role', protect, switchRole);

export default router;