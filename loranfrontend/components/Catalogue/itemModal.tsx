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
  const [measurements, setMeasurements] = useState<any>(null);
  const [measurementMethod, setMeasurementMethod] = useState<string | null>(null);
  const [shipping, setShipping] = useState<any>(null);
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
            <Image 
              src={item.imageUrl?.startsWith('/images/') 
                ? item.imageUrl 
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.imageUrl}`}
              alt={item.title} 
              fill 
              className="object-cover" 
            />
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
                onClick={() => {
                  // Ensure logged in as client
                  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
                  let role: string | null = null;
                  if (typeof window !== 'undefined') {
                    const userStr = sessionStorage.getItem('user');
                    if (userStr) {
                      try { role = JSON.parse(userStr)?.activeRole ?? null; } catch (err) { role = null; }
                    }
                  }

                  if (!token || !role) {
                    const ok = window.confirm('You must login or signup as a client to place an order.\n\nOK = Login, Cancel = Signup');
                    if (ok) return router.push('/login');
                    return router.push('/signup');
                  }

                  if (role !== 'client') {
                    const ok = window.confirm('You must be a client to place orders. Would you like to register as a client now?\n\nOK = Signup');
                    if (ok) return router.push('/signup');
                    return;
                  }

                  // Redirect to new order flow with design details
                  const params = new URLSearchParams({
                    designId: item._id,
                    designName: item.title,
                    designImage: item.imageUrl || '',
                    price: item.price.toString(),
                  });
                  router.push(`/order/new?${params.toString()}`);
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                Order Now
              </button>

              <button
                onClick={async () => {
                  // Simple manual measurements prompt for now (stub for AI integration)
                  try {
                    const h = window.prompt('Height (cm)', measurements?.height || '');
                    const chest = window.prompt('Chest (cm)', measurements?.chest || '');
                    const waist = window.prompt('Waist (cm)', measurements?.waist || '');
                    const hips = window.prompt('Hips (cm)', measurements?.hips || '');
                    const name = window.prompt('Shipping name', shipping?.name || '');
                    const city = window.prompt('Shipping city', shipping?.city || '');
                    const m = {} as any;
                    if (h) m.height = Number(h);
                    if (chest) m.chest = Number(chest);
                    if (waist) m.waist = Number(waist);
                    if (hips) m.hips = Number(hips);
                    setMeasurements(Object.keys(m).length ? m : null);
                    setMeasurementMethod('manual');
                    setShipping(name || city ? { name, city } : null);
                    alert('Measurements saved locally — proceed to Buy Now to include them with the order.');
                  } catch (err) {
                    console.error('Measurement capture error', err);
                    alert('Failed to capture measurements');
                  }
                }}
                className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                AI Try-On (manual stub)
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}