import Order from '../model/order.js';
import User from '../model/user.js';

// Submit review for a completed order
export const submitReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;
    const clientId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find the order
    const order = await Order.findById(orderId).populate('designerId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to this client
    if (order.userId.toString() !== clientId) {
      return res.status(403).json({ message: 'Not authorized to review this order' });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed orders' });
    }

    // Check if already reviewed
    if (order.review?.isReviewed) {
      return res.status(400).json({ message: 'Order already reviewed' });
    }

    // Check if designer is assigned
    if (!order.designerId) {
      return res.status(400).json({ message: 'No designer assigned to this order' });
    }

    // Update order with review
    order.review = {
      rating,
      comment: comment || '',
      reviewedAt: new Date(),
      isReviewed: true
    };
    await order.save();

    // Add review to designer's profile
    const designer = await User.findById(order.designerId);
    if (designer) {
      designer.reviews.push({
        orderId: order._id,
        clientId,
        rating,
        comment: comment || '',
        reviewedAt: new Date()
      });

      // Calculate new average rating
      const totalRating = designer.reviews.reduce((sum, review) => sum + review.rating, 0);
      designer.rating = totalRating / designer.reviews.length;
      designer.totalReviews = designer.reviews.length;

      await designer.save();
    }

    res.json({ 
      message: 'Review submitted successfully',
      review: order.review,
      designerRating: designer.rating
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews for a designer
export const getDesignerReviews = async (req, res) => {
  try {
    const { designerId } = req.params;

    const designer = await User.findById(designerId)
      .select('reviews rating totalReviews fullName brandName')
      .populate('reviews.clientId', 'fullName profilePicture');

    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    res.json({
      designerName: designer.brandName || designer.fullName,
      rating: designer.rating || 0,
      totalReviews: designer.totalReviews || 0,
      reviews: designer.reviews.sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt))
    });
  } catch (error) {
    console.error('Get designer reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get client's reviewable orders (completed orders without review)
export const getReviewableOrders = async (req, res) => {
  try {
    const clientId = req.user.id;

    const orders = await Order.find({
      userId: clientId,
      status: 'completed',
      'review.isReviewed': { $ne: true },
      designerId: { $exists: true, $ne: null }
    })
    .populate('designerId', 'fullName brandName')
    .populate('catalogueId', 'title imageUrl')
    .sort({ updatedAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get reviewable orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if order can be reviewed
export const canReviewOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const clientId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const canReview = 
      order.userId.toString() === clientId &&
      order.status === 'completed' &&
      !order.review?.isReviewed &&
      order.designerId;

    res.json({ canReview, reason: canReview ? null : getReviewBlockReason(order, clientId) });
  } catch (error) {
    console.error('Can review order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to get reason why review is blocked
function getReviewBlockReason(order, clientId) {
  if (order.userId.toString() !== clientId) return 'Not your order';
  if (order.status !== 'completed') return 'Order not completed yet';
  if (order.review?.isReviewed) return 'Already reviewed';
  if (!order.designerId) return 'No designer assigned';
  return 'Unknown reason';
}

export default { submitReview, getDesignerReviews, getReviewableOrders, canReviewOrder };
