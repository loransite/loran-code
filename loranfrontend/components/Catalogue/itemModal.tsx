// frontend/components/ItemModal.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CatalogueItem } from "@/app/types";
import { orderAPI, paymentAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  item: CatalogueItem;
  onClose: () => void;
}

export default function ItemModal({ item, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative h-96 md:h-full">
            <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.imageUrl}`} alt={item.title} fill className="object-cover" />
          </div>

          {/* Details */}
          <div className="p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
            {typeof item.designer === 'object' && item.designer?.id ? (
              <Link href={`/designers/${item.designer.id}`} className="text-indigo-600 font-medium hover:underline">
                by {item.designer.name}
              </Link>
            ) : (
              <span className="text-indigo-600 font-medium">by {typeof item.designer === 'string' ? item.designer : 'Unknown'}</span>
            )}
            <p className="text-3xl font-bold text-pink-600 mt-4">${item.price}</p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={async () => {
                  // Ensure logged in
                  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                  if (!token) return router.push('/login');

                  // Create order then initialize payment
                  try {
                    setLoading(true);
                    const createResp = await orderAPI.create({ catalogueId: item._id, total: item.price });
                    const order = createResp.data?.order || createResp.data;
                    const orderId = order?._id || order?.id;

                    if (!orderId) throw new Error('Order ID not returned');

                    const storedUser = localStorage.getItem('user');
                    const email = storedUser ? JSON.parse(storedUser).email : null;
                    if (!email) {
                      // If we don't have email, redirect user to profile/login to add email
                      alert('Please ensure you are logged in with an email address before checkout.');
                      setLoading(false);
                      return router.push('/login');
                    }

                    const initResp = await paymentAPI.initialize({ email, amount: item.price, orderId });
                    const authorization_url = initResp.data?.authorization_url;
                    if (!authorization_url) throw new Error('No authorization_url returned');

                    // Redirect to Paystack checkout
                    window.location.href = authorization_url;
                  } catch (err: any) {
                    console.error('Buy now error', err);
                    alert(err?.message || 'Failed to start checkout');
                    setLoading(false);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Processing…' : 'Buy Now'}
              </button>

              <button className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                AI Try-On
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}