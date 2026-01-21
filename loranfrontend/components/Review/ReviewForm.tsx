"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, X } from "lucide-react";
import axios from "axios";

interface ReviewFormProps {
  orderId: string;
  designerName: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ReviewForm({ orderId, designerName, onSuccess, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const token = localStorage.getItem("token");
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${orderId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Review Your Experience</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <p className="text-gray-600 mb-6">
          How was your experience with <strong>{designerName}</strong>?
        </p>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Your Review (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this designer..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
