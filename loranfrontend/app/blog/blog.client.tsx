"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function BlogClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-6 sm:px-10 py-16"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Loran Blog</h1>
          <p className="mt-3 max-w-3xl text-white/90">
            Ideas, guides, and stories across fashion, fit technology, and designer craft.
          </p>
          <p className="mt-2 text-sm text-white/80">Stay inspired. Updated regularly.</p>
        </motion.div>
      </section>

      <motion.section variants={container} initial="hidden" animate="visible" className="mt-10 space-y-8">
        {/* Featured Post */}
        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Perfect Fit with AI Measurements</h2>
          <p className="mt-3 text-gray-700">
            See how Loran’s AI measurement studio helps you find your perfect fit using front and side photos.
            Learn best practices for lighting, posture, and outfits to get accurate results.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/ai" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">Try AI Studio</Link>
            <Link href="/dashboard/client/measurements" className="px-4 py-2 rounded-lg bg-white text-indigo-700 border border-indigo-200 text-sm font-semibold hover:bg-indigo-50">View Measurements</Link>
          </div>
        </motion.article>

        {/* Designer Spotlight */}
        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Designer Spotlight: Craft, Color, and Form</h2>
          <p className="mt-3 text-gray-700">
            Meet our featured designers and explore how they blend traditional tailoring with modern aesthetics.
            From fabric selection to silhouette, discover the stories behind standout pieces.
          </p>
          <Link href="/designers" className="mt-4 inline-block px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700">Explore Designers</Link>
        </motion.article>

        {/* Fit Guides */}
        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Fit Guide: Measurements That Matter</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Chest & Shoulders: posture and arm placement for clarity.</li>
            <li>Waist & Hips: wear fitted clothing; avoid bulky layers.</li>
            <li>Inseam & Sleeves: stand straight; capture full limbs.</li>
          </ul>
          <p className="mt-3 text-gray-700">Save your best results to build a personal fit profile over time.</p>
        </motion.article>

        {/* Marketplace Tips */}
        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Marketplace Tips: Ordering with Confidence</h2>
          <p className="mt-3 text-gray-700">
            Browse the catalogue with filters, check designer reviews, and use your saved measurements to order with confidence.
            Designers tailor pieces to your profile for a premium fit experience.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/catalogue" className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600">Browse Catalogue</Link>
            <Link href="/reviews" className="px-4 py-2 rounded-lg bg-white text-pink-600 border border-pink-200 text-sm font-semibold hover:bg-pink-50">Read Reviews</Link>
          </div>
        </motion.article>
      </motion.section>
    </div>
  );
}