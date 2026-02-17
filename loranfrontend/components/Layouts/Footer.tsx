// components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Footer() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    duration: number;
    delay: number;
  }>>([]);

  // Generate sparkles only on client to avoid hydration mismatch
  useEffect(() => {
    setSparkles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  const socialLinks = [
    { name: "Twitter", icon: "𝕏", href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: "📷", href: "#", color: "hover:text-pink-400" },
    { name: "LinkedIn", icon: "💼", href: "#", color: "hover:text-blue-600" },
    { name: "TikTok", icon: "🎵", href: "#", color: "hover:text-purple-500" },
  ];

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Catalogue", href: "/catalogue" },
        { name: "Designers", href: "/designers" },
        { name: "AI Try-On", href: "/ai" },
        { name: "Reviews", href: "/reviews" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Cookies", href: "#" },
        { name: "Security", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 mt-20">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [-50, 50, -50],
            y: [-50, 50, -50],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Sparkle effect */}
      <div className="absolute inset-0 opacity-20">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Top section with logo and description */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h3
            className="font-bold text-5xl mb-4 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Loran
          </motion.h3>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            ✨ Connecting fashion visionaries with their perfect clients ✨
          </p>

          {/* Social links */}
          <div className="flex justify-center gap-6 mt-8">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={social.name}
                href={social.href}
                className={`text-3xl transition-colors duration-300 ${social.color}`}
                whileHover={{ scale: 1.3, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                title={social.name}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mb-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {footerSections.map((section, sectionIdx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIdx * 0.1, duration: 0.6 }}
            >
              <h4 className="font-bold text-xl mb-6 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <motion.li
                    key={link.name}
                    onHoverStart={() => setHoveredIndex(sectionIdx * 10 + linkIdx)}
                    onHoverEnd={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                    >
                      <motion.span
                        className="inline-block"
                        animate={{
                          x: hoveredIndex === sectionIdx * 10 + linkIdx ? 5 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        →
                      </motion.span>
                      <span className="group-hover:underline decoration-pink-400">
                        {link.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter section */}
        <motion.div
          className="mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-center text-xl font-semibold text-purple-200 mb-4">
            Stay Updated 💌
          </h4>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
            />
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Bottom section */}
        <motion.div
          className="text-center text-sm text-purple-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="flex items-center justify-center gap-2 flex-wrap"
            whileHover={{ scale: 1.02 }}
          >
            <span>© {new Date().getFullYear()} Loran.</span>
            <motion.span
              className="inline-block"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              ❤️
            </motion.span>
            <span>Crafted with passion in Nigeria</span>
            <motion.span
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🇳🇬
            </motion.span>
          </motion.p>
          <p className="mt-2 text-xs text-purple-400">
            Empowering fashion designers, one stitch at a time ✨
          </p>
        </motion.div>
      </div>
    </footer>
  );
}