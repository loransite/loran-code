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

export default function TermsClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-6 sm:px-10 py-16"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="mt-3 max-w-3xl text-white/90">
            Please read these terms carefully. By using Loran, you agree to them.
          </p>
          <p className="mt-2 text-sm text-white/80">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>
      </section>

      <motion.section variants={container} initial="hidden" animate="visible" className="mt-10 space-y-8">
        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">1. Using the Platform</h2>
          <p className="mt-3 text-gray-700">
            You must be at least 16 years old to use Loran. You agree to provide accurate account information and keep your credentials secure.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">2. Orders & Payments</h2>
          <p className="mt-3 text-gray-700">
            Orders are subject to designer acceptance. Payments are processed securely via Paystack; Loran does not store card numbers.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">3. Content & IP</h2>
          <p className="mt-3 text-gray-700">
            Designers retain rights to their original works. You may not copy, redistribute, or resell designs without permission.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">4. AI Features</h2>
          <p className="mt-3 text-gray-700">
            AI measurements require your consent. Uploaded images are used to provide fit guidance and not to train third-party models.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">5. Prohibited Conduct</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Harassment, hate, or illegal activity.</li>
            <li>Attempting to breach security or access other users’ data.</li>
            <li>Uploading infringing or inappropriate content.</li>
          </ul>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">6. Liability</h2>
          <p className="mt-3 text-gray-700">
            Loran is provided “as is.” To the extent permitted by law, we disclaim warranties and limit liability for indirect or consequential damages.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">7. Contact</h2>
          <p className="mt-3 text-gray-700">
            Questions about these terms? Email <span className="font-semibold text-indigo-600">legal@loran.com</span>.
          </p>
        </motion.article>
      </motion.section>
    </div>
  );
}