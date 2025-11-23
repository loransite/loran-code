import express from "express";
import { initializePayment, verifyPayment, webhookHandler } from "../controller/paymentcontroller.js";
import { getClientOrders } from "../controller/ordercontroller.js";
import { protect } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";

const router = express.Router();

// Client: initialize a payment for an order
router.post("/initialize", protect, authorizeRoles("client"), initializePayment);

// Optional: verify payment by reference (can be used on redirect)
router.get("/verify", verifyPayment);

// Paystack webhook: Paystack posts transaction events here
// Use raw body parsing for signature verification
router.post("/webhook", express.raw({ type: "application/json" }), webhookHandler);

// Client: get their orders via payments route (legacy)
router.get("/client", protect, getClientOrders);

export default router;