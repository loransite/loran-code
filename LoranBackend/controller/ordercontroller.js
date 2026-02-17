import Order from "../model/order.js";
import Catalogue from "../model/catalogue.js";
import { sendEmail } from "../services/emailService.js";

// Client: create an order for a catalogue item
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { catalogueId, total, measurements, measurementMethod, shipping } = req.body;

    if (!catalogueId || !total) {
      return res.status(400).json({ message: "catalogueId and total are required" });
    }

    // Lookup catalogue to get designer info
    const catalogueItem = await Catalogue.findById(catalogueId);
    if (!catalogueItem) return res.status(404).json({ message: "Catalogue item not found" });

    const orderData = {
      userId,
      catalogueId,
      designerId: catalogueItem.designer?.id || null,
      total,
      status: 'pending',
      paymentStatus: 'pending'
    };

    // Add optional measurements and shipping
    if (measurements) {
      orderData.measurements = measurements;
      orderData.measurementMethod = measurementMethod || null;
    }
    if (shipping) {
      orderData.shipping = shipping;
    }

    const order = await Order.create(orderData);

    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Client: get their orders
export const getClientOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { catalogueId } = req.query;
    const query = { userId };
    if (catalogueId) query.catalogueId = catalogueId;
    const orders = await Order.find(query).populate("catalogueId", "title description price");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching client orders:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Designer: get orders for designs that belong to this designer
export const getDesignerOrders = async (req, res) => {
  try {
    const designerId = req.user.id;
    const orders = await Order.find({ designerId }).populate("catalogueId", "title description price").populate("userId", "fullName email");
    res.json(orders);
  } catch (err) {
    console.error("Error fetching designer orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: approve or update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, designerNotes } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    
    const updateData = { status };
    if (designerNotes) updateData.designerNotes = designerNotes;
    
    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true })
      .populate('userId', 'fullName email')
      .populate('catalogueId', 'title')
      .populate('designerId', 'fullName email');
      
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    // Send status update notification to client
    if (order.userId?.email) {
      await sendEmail({
        to: order.userId.email,
        template: 'orderStatusUpdate',
        data: {
          customerName: order.userId.fullName,
          orderId: order._id,
          status: order.status,
          designerNotes: order.designerNotes,
          message: getStatusMessage(order.status),
        },
      }).catch(err => console.error('Email notification error:', err));
    }
    
    res.json({ message: "Order updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function for status messages
function getStatusMessage(status) {
  const messages = {
    'awaiting-payment': 'Please complete your payment to proceed.',
    'awaiting-contact': 'Our team will contact you soon to discuss your requirements.',
    'processing': 'Your design is being created! The designer is working on your order.',
    'completed': 'Your order is ready! Please check your email for pickup/delivery details.',
    'cancelled': 'Your order has been cancelled. If you have any questions, please contact us.',
    'confirmed': 'Your order is confirmed and will be processed soon.',
  };
  return messages[status] || 'Your order status has been updated.';
}

// Admin: get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('catalogueId', 'title description price').populate('userId', 'fullName email');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Client: delete their pending order (remove from cart)
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== userId) return res.status(403).json({ message: 'Not authorized' });
    if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Cannot remove a paid order' });

    await Order.findByIdAndDelete(orderId);
    res.json({ message: 'Order removed' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};