import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import { getAllUsers, getAllOrders } from "../controller/admincontroller.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);

export default router;