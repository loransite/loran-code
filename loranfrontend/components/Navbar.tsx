"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount] = useState<number>(2); // Replace with actual cart data later

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.nav
      className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-lg fixed top-0 left-0 w-full z-50"
      initial="hidden"
      animate="visible"
      variants={menuVariants}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-white font-extrabold text-2xl tracking-wide"
        >
          <Link href="/">LORAN</Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-white font-medium">
          <Link href="/">Home</Link>
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/designers">Designers</Link>
          <Link href="/aitryon">AI Try-On</Link>
          <Link href="/orders">Orders</Link>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-5">
          <Link
            href="/login"
            className="text-white hover:text-gray-200 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>

          {/* Cart */}
          <motion.div whileHover={{ scale: 1.1 }} className="relative">
            <ShoppingCart className="text-white cursor-pointer" size={24} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-indigo-700 text-white flex flex-col items-center space-y-3 py-4"
        >
          <Link href="/">Home</Link>
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/designers">Designers</Link>
          <Link href="/aitryon">AI Try-On</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/login">Login</Link>
          <Link
            href="/signup"
            className="bg-white text-blue-700 px-3 py-1 rounded-full"
          >
            Sign Up
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
