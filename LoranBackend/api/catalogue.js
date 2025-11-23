// routes/catalogue.js
import express from 'express';
import multer from 'multer';
import Catalogue from '../models/Catalogue.js'; // ← Your Mongoose model
import jwt from 'jsonwebtoken';

const router = express.Router();

// Multer: Save files to 'uploads/' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// JWT Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// POST: Upload new design
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image || !title || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newItem = new Catalogue({
      title,
      description,
      price: Number(price),
      image,
      uploadedBy: req.user.id, // From JWT
    });

    await newItem.save();
    res.status(201).json({ message: 'Design uploaded!', item: newItem });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Fetch all catalogue items
router.get('/', async (req, res) => {
  try {
    const items = await Catalogue.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load catalogue' });
  }
});

export default router;