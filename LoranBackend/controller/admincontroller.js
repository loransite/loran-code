import User from '../model/user.js';
import Order from '../model/order.js';


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