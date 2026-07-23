import Order from "../model/order.js";
import Catalogue from "../model/catalogue.js";
import User from "../model/user.js";
import {
  sendDesignerNewOrderEmail,
  sendAdminNewOrderEmail,
  sendClientOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} from "../services/emailService.js";

// Client: create an order for a catalogue item
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { catalogueId, total, measurements, measurementMethod, shipping, customizationRequest, clientNotes } = req.body;

    if (!catalogueId || !total) {
      return res.status(400).json({ message: "catalogueId and total are required" });
    }

    // Validate measurements if provided
    if (measurements) {
      if (measurements.height && (measurements.height <= 0 || measurements.height > 300)) {
        return res.status(400).json({ message: "Invalid height value. Must be between 0 and 300." });
      }
      // Validate other measurement fields
      const measurementFields = ['chest', 'waist', 'hips', 'shoulder', 'sleeveLength', 'inseam'];
      for (const field of measurementFields) {
        if (measurements[field] && (measurements[field] <= 0 || measurements[field] > 300)) {
          return res.status(400).json({ message: `Invalid ${field} value. Must be between 0 and 300.` });
        }
      }
    }

    // Validate shipping if provided
    if (shipping) {
      if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city || !shipping.country) {
        return res.status(400).json({ message: "Shipping details are incomplete. Name, phone, address, city, and country are required." });
      }
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
      orderData.hasMeasurements = true;
    }
    if (shipping) {
      orderData.shipping = shipping;
    }
    if (customizationRequest) orderData.customizationRequest = customizationRequest;
    if (clientNotes) orderData.clientNotes = clientNotes;

    const order = await Order.create(orderData);

    // Save measurements to user history if provided
    if (measurements && measurementMethod) {
      try {
        const user = await User.findById(userId);
        if (user) {
          if (!user.measurementHistory) {
            user.measurementHistory = [];
          }
          user.measurementHistory.push({
            date: new Date(),
            method: measurementMethod,
            measurements: measurements,
            aiData: measurementMethod === 'ai' ? { source: 'order_creation' } : {}
          });
          // Update current height if provided
          if (measurements.height) {
            user.height = measurements.height;
          }
          await user.save();
        }
      } catch (saveError) {
        console.error('Error saving measurement history:', saveError);
        // Don't fail the order creation if measurement history save fails
      }
    }

    // ── Notify all parties (designer, admin, client) of the new pending order ──
    // Best-effort: never let a mail failure break the order creation.
    const client = await User.findById(userId).select('fullName email');
    const designer = order.designerId ? await User.findById(order.designerId).select('fullName email') : null;

    const orderDetails = {
      orderId: order._id,
      designName: catalogueItem.title,
      amount: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      measurements: order.measurements,
      measurementMethod: order.measurementMethod,
      shipping: order.shipping,
      customizationRequest: order.customizationRequest,
      clientNotes: order.clientNotes,
      customerName: client?.fullName || 'Client',
      customerEmail: client?.email || '',
      designerName: designer?.fullName || 'Unassigned',
      currency: process.env.CURRENCY_SYMBOL || '₦',
    };

    const notified = { admin: false, designer: false };

    if (designer?.email) {
      const result = await sendDesignerNewOrderEmail(designer.email, designer.fullName, orderDetails);
      notified.designer = !!result.success;
    }

    let adminEmails = [];
    if (process.env.ADMIN_EMAIL) {
      adminEmails = process.env.ADMIN_EMAIL.split(',').map((e) => e.trim()).filter(Boolean);
    } else {
      const admins = await User.find({ roles: 'admin' }).select('email');
      adminEmails = admins.map((a) => a.email).filter(Boolean);
    }
    for (const adminEmail of adminEmails) {
      const result = await sendAdminNewOrderEmail(adminEmail, orderDetails);
      if (result.success) notified.admin = true;
    }

    if (client?.email) {
      await sendClientOrderConfirmationEmail(client.email, client.fullName, orderDetails);
    }

    order.notified = notified;
    await order.save();

    res.status(201).json({
      message: "Your order has been placed. The designer and our team have been notified.",
      order,
    });
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

    const requesterRole = req.user?.role;
    const requesterId = req.user?.id;
    const allowedDesignerStatuses = ['processing', 'completed'];

    if (requesterRole === 'designer' && !allowedDesignerStatuses.includes(status)) {
      return res.status(403).json({ message: 'Designers can only update orders to processing or completed.' });
    }

    const existingOrder = await Order.findById(orderId).select('designerId');
    if (!existingOrder) return res.status(404).json({ message: "Order not found" });

    if (requesterRole === 'designer') {
      if (!existingOrder.designerId || existingOrder.designerId.toString() !== requesterId) {
        return res.status(403).json({ message: 'You can only update your own assigned orders.' });
      }
    }
    
    const updateData = { status };
    if (designerNotes) updateData.designerNotes = designerNotes;
    
    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true })
      .populate('userId', 'fullName email')
      .populate('catalogueId', 'title')
      .populate('designerId', 'fullName email');
      
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    // Send status update notification to client
    if (order.userId?.email) {
      await sendOrderStatusUpdateEmail(order.userId.email, order.userId.fullName, {
        orderId: order._id,
        designName: order.catalogueId?.title || 'Custom Design',
        amount: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        measurements: order.measurements,
        customizationRequest: order.customizationRequest,
        designerNotes: order.designerNotes,
        message: getStatusMessage(order.status),
        currency: process.env.CURRENCY_SYMBOL || '₦',
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
    const orders = await Order.find({})
      .populate('catalogueId', 'title description price')
      .populate('userId', 'fullName email')
      .populate('designerId', 'fullName email brandName')
      .sort({ createdAt: -1 });
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