import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import { getAllUsers, getAllOrders, approveDesigner, approveCatalogueItem, getAllCatalogue } from "../controller/admincontroller.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);
router.get("/catalogue", protect, authorizeRoles("admin"), getAllCatalogue);
router.post("/approve-designer", protect, authorizeRoles("admin"), approveDesigner);
router.post("/approve-item", protect, authorizeRoles("admin"), approveCatalogueItem);

export default router;