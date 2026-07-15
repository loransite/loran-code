import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import {
	getAllUsers,
	getAllOrders,
	approveDesigner,
	approveCatalogueItem,
	getAllCatalogue,
	getAnalytics,
	getAllActivities,
	createAdminUser,
	notifyApprovedDesigners,
} from "../controller/admincontroller.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);
router.get("/catalogue", protect, authorizeRoles("admin"), getAllCatalogue);
router.get("/analytics", protect, authorizeRoles("admin"), getAnalytics);
router.get("/activities", protect, authorizeRoles("admin"), getAllActivities);
router.post("/approve-designer", protect, authorizeRoles("admin"), approveDesigner);
router.post("/approve-item", protect, authorizeRoles("admin"), approveCatalogueItem);
router.post("/create-admin", protect, authorizeRoles("admin"), createAdminUser);
router.post("/notify-approved-designers", protect, authorizeRoles("admin"), notifyApprovedDesigners);

export default router;