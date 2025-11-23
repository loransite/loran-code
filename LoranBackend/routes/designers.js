import express from 'express';
import User from '../model/user.js';

const router = express.Router();

// Public: list all registered designers
router.get('/', async (req, res) => {
  try {
    const designers = await User.find({ role: 'designer' }).select('_id fullName createdAt');
    // Map to a compact shape for frontend
    const result = designers.map(d => ({ id: d._id, name: d.fullName, joinedAt: d.createdAt }));
    res.json(result);
  } catch (err) {
    console.error('Failed to fetch designers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: designer profile + uploads
router.get('/:id', async (req, res) => {
  try {
    const designerId = req.params.id;
    const user = await User.findById(designerId).select('_id fullName createdAt bio avatarUrl rating');
    if (!user) return res.status(404).json({ message: 'Designer not found' });

    // Fetch their catalogue uploads
    const Catalogue = await import('../model/catalogue.js');
    const uploads = await Catalogue.default.find({ 'designer.id': designerId }).sort({ createdAt: -1 });

    const jobsDone = uploads.length;
    const yearsExperience = Math.max(0, new Date().getFullYear() - new Date(user.createdAt).getFullYear());
    const rating = user.rating || null;

    res.json({
      id: user._id,
      name: user.fullName,
      bio: user.bio || null,
      avatarUrl: user.avatarUrl || null,
      joinedAt: user.createdAt,
      yearsExperience,
      rating,
      jobsDone,
      uploads,
    });
  } catch (err) {
    console.error('Failed to fetch designer profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
