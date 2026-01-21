import User from '../model/user.js';
import Order from '../model/order.js';
import Catalogue from '../model/catalogue.js';


export const getAllUsers = async (req, res) => {
try {
const users = await User.find().select('-password');
res.json({ users });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


export const getAllOrders = async (req, res) => {
try {
const orders = await Order.find().populate('client', 'name email').populate('designer', 'name email').populate('design');
res.json({ orders });
} catch (err) {
res.status(500).json({ message: err.message });
}
};

export const getAllCatalogue = async (req, res) => {
  try {
    const items = await Catalogue.find().populate('uploadedBy', 'fullName email');
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveDesigner = async (req, res) => {
  try {
    const { userId, action } = req.body; // action: 'approve' or 'reject'

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === 'approve') {
      user.designerStatus = 'approved';
      if (!user.roles.includes('designer')) {
        user.roles.push('designer');
      }
      // Also update singular role if it was a client only
      if (user.role === 'client') {
        user.role = 'designer'; // Or keep as is, but setting it helps legacy/simpler checks
      }
      await user.save();
      return res.json({ message: "Designer approved successfully", user });
    } else {
      user.designerStatus = 'rejected';
      await user.save();
      return res.json({ message: "Designer application rejected", user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const approveCatalogueItem = async (req, res) => {
  try {
    const { itemId, action } = req.body; // action: 'approve' or 'reject'

    const item = await Catalogue.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = action === 'approve' ? 'approved' : 'rejected';
    await item.save();

    res.json({ message: `Item ${item.status} successfully`, item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
