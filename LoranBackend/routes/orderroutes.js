// routes/orderroutes.js
import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import { createOrder, getClientOrders, getDesignerOrders, updateOrderStatus } from "../controller/ordercontroller.js";
import { getAllOrders, deleteOrder } from "../controller/ordercontroller.js";

const router = express.Router();

// Client: create an order
router.post("/", protect, authorizeRoles("client"), createOrder);

// Client: delete an order (remove from cart)
router.delete("/:id", protect, authorizeRoles("client"), deleteOrder);

// Client: get their orders
router.get("/client", protect, authorizeRoles("client"), getClientOrders);

// Designer: get orders for their designs
router.get("/designer", protect, authorizeRoles("designer"), getDesignerOrders);

// Admin: get all orders
router.get("/", protect, authorizeRoles("admin"), getAllOrders);

// Admin: update order status (approve, cancel, etc.)
router.put("/:id/status", protect, authorizeRoles("admin"), updateOrderStatus);

export default router;
