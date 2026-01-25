"use client";

import { motion } from "framer-motion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Loran",
  description: "How Loran collects, uses, and protects your data.",
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-6 sm:px-10 py-16"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-3 max-w-3xl text-white/90">
            Your privacy matters. This page explains what data we collect, how we use it,
            and the choices you have.
          </p>
          <p className="mt-2 text-sm text-white/80">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>
      </section>

      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        className="mt-10 space-y-8"
      >
        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Account details: name, email, password (hashed), roles.</li>
            <li>Profile data: optional photo, client measurements, designer profile details.</li>
            <li>Usage data: pages visited, interactions, device/browser metadata.</li>
            <li>Payment data: processed via Paystack; we do not store card numbers.</li>
          </ul>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">How We Use Your Information</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>To create and manage your account and roles.</li>
            <li>To provide marketplace features: catalogue browsing, ordering, reviews.</li>
            <li>To enable AI try‑on and measurements (with your consent).</li>
            <li>To communicate important updates and transactional emails.</li>
            <li>To improve performance, security, and user experience.</li>
          </ul>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">AI Processing & Images</h2>
          <p className="mt-3 text-gray-700">
            If you use AI features, your uploaded images may be sent securely to our processing service.
            We do not use your images to train third‑party models. You can delete history anytime and
            request removal of stored assets.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Cookies & Storage</h2>
          <p className="mt-3 text-gray-700">
            We use cookies/session storage for authentication and preferences. You can control cookies in your
            browser settings. Some features may not work without them.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Data Sharing</h2>
          <p className="mt-3 text-gray-700">
            We only share data with service providers necessary to operate Loran (hosting, payments, email).
            We do not sell your personal data.
          </p>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Your Rights</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Access, update, or delete your account data.</li>
            <li>Withdraw consent for AI features at any time.</li>
            <li>Request data export and removal by contacting support.</li>
          </ul>
        </motion.article>

        <motion.article variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Contact</h2>
          <p className="mt-3 text-gray-700">
            Questions or requests? Email us at <span className="font-medium text-indigo-600">support@loran.com</span>.
          </p>
        </motion.article>
      </motion.section>
    </div>
  );
}
