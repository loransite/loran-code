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
        { name: "Press", href: "/press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Designer Guide", href: "/blog" },
        { name: "Client Guide", href: "/blog" },
        { name: "AI Features", href: "/ai" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Cookies", href: "/cookies" },
        { name: "Security", href: "/security" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden mt-20" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      {/* Subtle ambient blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <motion.div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7C2D3B] rounded-full mix-blend-multiply filter blur-3xl" animate={{ x: [0,50,0], y: [0,30,0], scale: [1,1.1,1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#1B4035] rounded-full mix-blend-multiply filter blur-3xl" animate={{ x: [0,-50,0], y: [0,-30,0], scale: [1,1.2,1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      {/* Sparkle effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {sparkles.map((sparkle) => (
          <motion.div key={sparkle.id} className="absolute w-px h-px rounded-full" style={{ left: `${sparkle.left}%`, top: `${sparkle.top}%`, background: "var(--highlight)" }} animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }} transition={{ duration: sparkle.duration, repeat: Infinity, delay: sparkle.delay }} />
        ))}
      </div>

      <div className="relative z-10">

        {/* ── Stats bar ── */}
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              {[
                { n: "1,200+", l: "Designers" },
                { n: "18,500+", l: "Orders completed" },
                { n: "24", l: "Countries" },
                { n: "99%", l: "Satisfaction" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl md:text-3xl font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--highlight)" }}>{s.n}</p>
                  <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--muted)", letterSpacing: "0.1em" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main footer body ── */}
        <div className="container mx-auto px-6 py-16">

          {/* Top: Logo + tagline + newsletter */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Link href="/">
                <h3 className="text-4xl mb-3 inline-block" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--highlight)" }}>Loran</h3>
              </Link>
              <p className="max-w-sm mb-6" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                The bespoke fashion marketplace. Connecting independent designers with clients who want clothing made for them.
              </p>
              {/* Social icons */}
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <motion.a key={social.name} href={social.href} className="w-9 h-9 flex items-center justify-center text-sm transition-all" style={{ background: "var(--surface-2)", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--muted)" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--highlight)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} title={social.name}>
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--highlight)", letterSpacing: "0.1em" }}>Stay Updated</p>
              <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>New designers, AI features, and style drops — direct to your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 text-sm transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none" }} onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,220,192,0.4)")} onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")} />
                <motion.button className="px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all" style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }} whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(232,220,192,0.2)" }} whileTap={{ scale: 0.97 }}>
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div className="h-px mb-12" style={{ background: "var(--border)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />

          {/* 4-column links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            {footerSections.map((section, sectionIdx) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: sectionIdx * 0.08, duration: 0.5 }}>
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--highlight)", letterSpacing: "0.1em" }}>
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <motion.li key={link.name} onHoverStart={() => setHoveredIndex(sectionIdx * 10 + linkIdx)} onHoverEnd={() => setHoveredIndex(null)}>
                      <Link href={link.href} className="text-sm flex items-center gap-1.5 transition-all" style={{ color: "var(--muted)" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                        <motion.span className="text-xs opacity-50" animate={{ x: hoveredIndex === sectionIdx * 10 + linkIdx ? 3 : 0 }} transition={{ type: "spring", stiffness: 300 }}>→</motion.span>
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div className="h-px mb-8" style={{ background: "var(--border)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              © {new Date().getFullYear()} Loran. Crafted with passion in Nigeria 🇳🇬
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6EBD8A" }} />
              <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>All systems operational</span>
            </div>
            <div className="flex gap-6">
              {[{ name: "Privacy", href: "/privacy" }, { name: "Terms", href: "/terms" }, { name: "Security", href: "/security" }].map((l) => (
                <Link key={l.name} href={l.href} className="text-xs transition-all" style={{ color: "var(--muted)" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}