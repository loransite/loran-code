// components/hero/Hero.tsx
"use client"; // ← Framer Motion runs only on the client

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, staggerContainer, parallaxBg } from "@/app/lib/animations";
import Button from "@/components/ui/Button";

/* --------------------------------------------------------------
   Import the hero image – Next.js will optimise it automatically
   -------------------------------------------------------------- */
// Use the provided replacement hero image to avoid licensed content
import heroBg from "@/public/images/replace.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* ---- Parallax background (motion) ---- */}
      <motion.div
        className="absolute inset-0 -z-10"
        variants={parallaxBg}
        initial="hidden"
        animate="visible"
      >
        {/* Next/Image fills the whole container */}
        <Image
          src={heroBg}
          alt="Loran hero background – fashion runway"
          fill
          className="object-cover"
          priority // loads instantly (hero is LCP)
        />
      </motion.div>

      {/* ---- Deep overlay aligned to --bg token ---- */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, #0E2A22 0%, rgba(14,42,34,0.72) 50%, rgba(14,42,34,0.35) 100%)" }}
      />

      {/* ---- CSS grid overlay (decorative, behind content) ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,220,192,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(232,220,192,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* ---- Content ---- */}
      <motion.div
        className="relative z-10 container mx-auto text-center px-4 sm:px-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Pill badge — WHO this is for */}
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase"
            style={{
              borderRadius: "999px",
              border: "1px solid var(--border)",
              background: "rgba(232,220,192,0.07)",
              color: "var(--highlight)",
              letterSpacing: "0.1em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6EBD8A" }} />
            For designers &amp; clients · Bespoke fashion, reimagined
          </span>
        </motion.div>

        {/* H1 — WHAT: core benefit in plain language */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl mb-6"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            letterSpacing: "-0.015em",
            color: "var(--text)",
            textShadow: "0 2px 40px rgba(0,0,0,0.5)",            fontSize: "clamp(32px, 9vw, 72px)",          }}
          variants={fadeUp}
        >
          Custom Clothing,{" "}
          <span style={{ color: "var(--highlight)" }}>Made for You</span>
        </motion.h1>

        {/* Subheadline — WHO + problem solved */}
        <motion.p
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10"
          style={{ color: "var(--muted)", lineHeight: 1.7 }}
          variants={fadeUp}
        >
          Clients get AI-measured, perfectly fitting bespoke pieces.
          Designers get direct orders, zero middlemen.
        </motion.p>

        {/* CTAs — full-width stacked on mobile, inline on sm+ */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          variants={fadeUp}
        >
          <Button href="/catalogue" variant="primary" className="w-full sm:w-auto text-center">
            Browse the Catalogue
          </Button>
          <Button href="/designers" variant="secondary" className="w-full sm:w-auto text-center">
            Meet Our Designers
          </Button>
        </motion.div>

        {/* ---- Designer ↔ Client connector ---- */}
        <motion.div
          className="mt-12 hidden sm:flex justify-center items-center gap-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-xl"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--highlight)" }}
            >
              D
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Designer</p>
          </div>

          <motion.div
            className="w-32 h-px"
            style={{ background: "var(--border)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />

          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-xl"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--highlight)" }}
            >
              C
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Client</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}