import express from 'express';
import multer from 'multer';
import { signup, login } from '../controller/authcontroller.js';

const router = express.Router();

// Multer config for avatar uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/avatars/'),
	filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Accept multipart/form-data on signup so designers can upload avatar
router.post('/signup', upload.single('avatar'), signup);
router.post('/login', login);

export default router;