"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import axios from "axios";
import ReviewForm from "@/components/Review/ReviewForm";
import Image from "next/image";

interface ReviewableOrder {
  _id: string;
  catalogueId: {
    title: string;
    imageUrl: string;
  };
  designerId: {
    _id: string;
    fullName: string;
    brandName: string;
  };
  total: number;
  updatedAt: string;
}

export default function ReviewsPage() {
  const [orders, setOrders] = useState<ReviewableOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ReviewableOrder | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviewableOrders();
  }, []);

  const fetchReviewableOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/reviewable`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Failed to load reviewable orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (order: ReviewableOrder) => {
    setSelectedOrder(order);
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setSelectedOrder(null);
    fetchReviewableOrders(); // Refresh the list
    
    // Show success message
    alert("✨ Thank you for your review!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Review Your Orders</h1>
          <p className="text-gray-600">
            Share your experience with designers you've worked with
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
            <p className="text-gray-600">
              You've reviewed all your completed orders. Thank you for your feedback!
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex items-start gap-6">
                  {/* Design Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {order.catalogueId?.imageUrl ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${order.catalogueId.imageUrl}`}
                        alt={order.catalogueId.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">
                      {order.catalogueId?.title || "Custom Design"}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Designer: <strong>{order.designerId?.brandName || order.designerId?.fullName}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Completed: {new Date(order.updatedAt).toLocaleDateString()} • ₦{order.total.toLocaleString()}
                    </p>
                  </div>

                  {/* Review Button */}
                  <button
                    onClick={() => handleReviewClick(order)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2 whitespace-nowrap"
                  >
                    <Star className="w-4 h-4" />
                    Write Review
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review Form Modal */}
        <AnimatePresence>
          {showReviewForm && selectedOrder && (
            <ReviewForm
              orderId={selectedOrder._id}
              designerName={selectedOrder.designerId.brandName || selectedOrder.designerId.fullName}
              onSuccess={handleReviewSuccess}
              onClose={() => {
                setShowReviewForm(false);
                setSelectedOrder(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
