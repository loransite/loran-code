"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stats = [
  { label: "Designers on platform", value: "1,200+" },
  { label: "Orders completed", value: "18,500+" },
  { label: "Countries reached", value: "24" },
  { label: "Founded", value: "2024" },
];

const coverageItems = [
  {
    outlet: "TechCabal",
    headline: "Loran is building the future of bespoke fashion in Africa",
    date: "March 2025",
  },
  {
    outlet: "Vanguard",
    headline: "Nigerian startup bridges designers and clients with AI",
    date: "January 2025",
  },
  {
    outlet: "Disrupt Africa",
    headline: "Loran raises pre-seed to scale fashion marketplace",
    date: "November 2024",
  },
];

export default function PressClient() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden py-20 px-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,220,192,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,220,192,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase mb-6"
            style={{
              borderRadius: "999px",
              border: "1px solid var(--border)",
              background: "rgba(232,220,192,0.07)",
              color: "var(--highlight)",
              letterSpacing: "0.1em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6EBD8A" }} />
            Media &amp; Press
          </span>
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          >
            Loran in the Press
          </h1>
          <p className="text-lg" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Resources for journalists, bloggers, and media professionals covering
            fashion, technology, and African innovation.
          </p>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Stats */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2
            className="text-2xl mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          >
            Loran by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={item}
                className="p-6 rounded-2xl text-center"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
              >
                <p
                  className="text-3xl font-medium mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--highlight)" }}
                >
                  {s.value}
                </p>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* About Loran */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={item}
            className="p-8 rounded-2xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
            >
              About Loran
            </h2>
            <p className="mb-3" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              Loran is a bespoke fashion marketplace connecting independent designers
              with clients who want clothing made specifically for them. Built in
              Nigeria and serving customers across Africa and the diaspora, Loran
              combines AI-powered body measurement with direct designer-to-client
              ordering.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              Our platform eliminates the middlemen, ensures designers get paid
              fairly, and gives clients garments that actually fit.
            </p>
          </motion.div>
        </motion.section>

        {/* Coverage */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2
            className="text-2xl mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          >
            Recent Coverage
          </h2>
          <div className="space-y-4">
            {coverageItems.map((c, i) => (
              <motion.div
                key={i}
                variants={item}
                className="p-6 rounded-2xl flex items-start justify-between gap-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: "var(--highlight)", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                  >
                    {c.outlet}
                  </p>
                  <p style={{ color: "var(--text)", lineHeight: 1.6 }}>{c.headline}</p>
                </div>
                <p
                  className="text-xs whitespace-nowrap"
                  style={{ color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {c.date}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Media Kit & Contact */}
        <motion.section
          className="grid md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={item}
            className="p-8 rounded-2xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <h3
              className="text-xl mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
            >
              Media Kit
            </h3>
            <p className="mb-6 text-sm" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              Download our logo pack, brand guidelines, product screenshots, and
              founder bios in one zip.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all"
              style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
            >
              Download Media Kit
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="p-8 rounded-2xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <h3
              className="text-xl mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
            >
              Press Contact
            </h3>
            <p className="mb-4 text-sm" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              For interview requests, editorial enquiries, and media partnerships:
            </p>
            <a
              href="mailto:press@loran.ng"
              className="text-sm font-semibold"
              style={{ color: "var(--highlight)" }}
            >
              press@loran.ng
            </a>
          </motion.div>
        </motion.section>

        {/* Back */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm transition-all"
            style={{ color: "var(--muted)" }}
          >
            ← Back to Loran
          </Link>
        </div>
      </div>
    </div>
  );
}
