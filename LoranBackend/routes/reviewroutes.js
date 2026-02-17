import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { authorizeRoles } from '../middleware/rolemiddleware.js';
import { submitReview, getDesignerReviews, getReviewableOrders, canReviewOrder } from '../controller/reviewcontroller.js';

const router = express.Router();

// Client: Submit a review for a completed order
router.post('/:orderId', protect, authorizeRoles('client'), submitReview);

// Public: Get all reviews for a designer
router.get('/designer/:designerId', getDesignerReviews);

// Client: Get orders that can be reviewed
router.get('/reviewable', protect, authorizeRoles('client'), getReviewableOrders);

// Client: Check if an order can be reviewed
router.get('/can-review/:orderId', protect, authorizeRoles('client'), canReviewOrder);

export default router;
