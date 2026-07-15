"use client"
// components/sections/Testimonials.tsx
import { motion } from "framer-motion";
import { fadeUp } from "@/app/lib/animations";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const quotes = [
  { text: "Loran turned my sketch into a client-ready masterpiece in 48h!", author: "Isabella M." },
  { text: "The AI try-on saved me 3 fittings. Incredible!", author: "James K." },
  { text: "Finally a platform that pays designers fairly.", author: "Nia O." },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6" style={{ background: "var(--bg)" }}>
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-2xl sm:text-4xl md:text-5xl text-center mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Loved by Designers &amp; Clients
        </motion.h2>
        <motion.p
          className="text-center mb-12"
          style={{ color: "var(--muted)" }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Real stories from the Loran community.
        </motion.p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              className="p-5 md:p-8 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -3, borderColor: "rgba(232,220,192,0.25)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, s) => (
                  <StarIcon key={s} className="w-4 h-4" style={{ color: "var(--highlight)" }} />
                ))}
              </div>
              <p className="italic mb-4" style={{ color: "var(--text)", lineHeight: 1.7 }}>&quot;{q.text}&quot;</p>
              <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>— {q.author}</p>
            </motion.div>
          ))}
        </div>

        {/* ── NOW: final conversion CTA ── */}
        <motion.div
          className="mt-12 md:mt-20 text-center px-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3
            className="text-2xl sm:text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          >
            Your perfect fit is one order away.
          </h3>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: "var(--muted)" }}>
            Browse hundreds of bespoke designs, get AI-measured in minutes, and order direct from the designer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold tracking-wide transition-all"
              style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
            >
              Browse the Catalogue
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold tracking-wide transition-all"
              style={{ border: "1px solid var(--border)", color: "var(--text)", borderRadius: "3px" }}
            >
              Create a Free Account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}