import express from 'express';
import User from '../model/user.js';
import Design from '../model/design.js';
import Catalogue from '../model/catalogue.js';

const router = express.Router();

// Public: list all registered designers
router.get('/', async (req, res) => {
  try {
    const designers = await User.find({
      designerStatus: 'approved',
      $or: [
        { roles: 'designer' },
        { role: 'designer' },
      ],
    })
      .select('_id fullName createdAt avatarUrl profilePicture')
      .sort({ createdAt: -1 });
    // Map to a compact shape for frontend
    const result = designers.map(d => ({
      id: d._id,
      name: d.fullName,
      joinedAt: d.createdAt,
      avatarUrl: d.avatarUrl || d.profilePicture || null,
    }));
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

    // Fetch catalogue uploads (robust: either stored by designer.id or uploadedBy)
    const catalogueUploads = await Catalogue.find({
      $or: [
        { 'designer.id': designerId },
        { uploadedBy: designerId },
      ],
    }).sort({ createdAt: -1 });

    // Include legacy design uploads not mirrored yet into catalogue
    const legacyDesigns = await Design.find({ designer: designerId }).sort({ createdAt: -1 });

    const mappedLegacy = legacyDesigns.map((d) => ({
      _id: d._id,
      title: d.title,
      price: d.price,
      image: d.imageUrl,
      description: d.description,
      status: 'approved',
      createdAt: d.createdAt,
      source: 'design',
    }));

    const mergedUploads = [...catalogueUploads.map((c) => ({ ...c.toObject(), source: 'catalogue' })), ...mappedLegacy]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const jobsDone = mergedUploads.length;
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
      uploads: mergedUploads,
    });
  } catch (err) {
    console.error('Failed to fetch designer profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
