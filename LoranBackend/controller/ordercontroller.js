import Order from "../model/order.js";
import Catalogue from "../model/catalogue.js";

// Client: create an order for a catalogue item
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { catalogueId, total } = req.body;

    if (!catalogueId || !total) {
      return res.status(400).json({ message: "catalogueId and total are required" });
    }

    // Lookup catalogue to get designer info
    const catalogueItem = await Catalogue.findById(catalogueId);
    if (!catalogueItem) return res.status(404).json({ message: "Catalogue item not found" });

    const order = await Order.create({
      userId,
      catalogueId,
      designerId: catalogueItem.designer?.id || null,
      total,
    });

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
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};