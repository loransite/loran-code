import Design from '../model/design.js';


export const createDesign = async (req, res) => {
try {
const { title, description, price } = req.body;
const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
const designerId = req.user.id;


const design = await Design.create({ designer: designerId, title, description, imageUrl, price });
res.status(201).json({ message: 'Design created', design });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


export const getDesigns = async (req, res) => {
try {
const designs = await Design.find().populate('designer', 'name email');
res.json({ designs });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


export const getDesignerDesigns = async (req, res) => {
try {
const designerId = req.params.designerId;
const designs = await Design.find({ designer: designerId });
res.json({ designs });
} catch (err) {
res.status(500).json({ message: err.message });
}
};