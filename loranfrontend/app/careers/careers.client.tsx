"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function CareersClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-6 sm:px-10 py-16"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Careers at Loran</h1>
          <p className="mt-3 max-w-3xl text-white/90">
            We're building the future of bespoke fashion — blending design, engineering, and AI.
            Join a product-focused team shipping delightful experiences.
          </p>
          <p className="mt-2 text-sm text-white/80">We hire globally. Remote-first.</p>
        </motion.div>
      </section>

      <motion.section variants={container} initial="hidden" animate="visible" className="mt-10 space-y-8">
        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Open Roles</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Frontend Engineer (Next.js, React, Tailwind)</li>
            <li>Backend Engineer (Node.js, Express, MongoDB)</li>
            <li>Designer Success Manager</li>
            <li>Product Designer (UI/UX)</li>
          </ul>
          <p className="mt-3 text-gray-700">
            Don't see your role? We love great talent — reach out.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">How We Work</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Remote-first, async-friendly collaboration.</li>
            <li>Ownership, clarity, and continuous delivery.</li>
            <li>Customer empathy and measurable impact.</li>
            <li>Design-led, accessibility-minded product craft.</li>
          </ul>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Apply</h2>
          <p className="mt-3 text-gray-700">
            Email a short note with links (portfolio, GitHub, case studies) to
            <span className="font-semibold text-indigo-600"> careers@loran.com</span>.
            Include your timezone and earliest start date.
          </p>
        </motion.article>
      </motion.section>
    </div>
  );
}