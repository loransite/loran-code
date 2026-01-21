"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import axios from "axios";

interface Review {
  _id: string;
  clientId: {
    fullName: string;
    profilePicture?: string;
  };
  rating: number;
  comment: string;
  reviewedAt: string;
}

interface ReviewListProps {
  designerId: string;
}

export default function ReviewList({ designerId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [designerId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/designer/${designerId}`
      );
      setReviews(response.data.reviews);
      setAverageRating(response.data.rating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-600">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-12">{rating} star</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No reviews yet. Be the first to review this designer!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {review.clientId?.profilePicture ? (
                    <img
                      src={review.clientId.profilePicture}
                      alt={review.clientId.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      {review.clientId?.fullName || "Anonymous"}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(review.reviewedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
