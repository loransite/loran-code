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

const cookieTypes = [
  {
    name: "Strictly Necessary",
    required: true,
    desc: "These cookies are essential for the platform to function. They handle authentication sessions, security tokens, and core routing. You cannot opt out of these.",
    examples: ["Session token", "CSRF protection", "Auth state"],
  },
  {
    name: "Functional",
    required: false,
    desc: "These cookies remember your preferences — such as your active role (client or designer), saved filters in the catalogue, and measurement history display.",
    examples: ["Active role preference", "Catalogue filter state", "UI theme preference"],
  },
  {
    name: "Analytics",
    required: false,
    desc: "We use anonymised analytics to understand how visitors use Loran so we can improve the product. No personally identifiable data is collected.",
    examples: ["Page views", "Feature usage", "Error tracking"],
  },
  {
    name: "Third-Party",
    required: false,
    desc: "Some features embed third-party services such as Paystack for payments. These services may set their own cookies governed by their privacy policies.",
    examples: ["Paystack payment flow", "Cloudinary media CDN"],
  },
];

export default function CookiesClient() {
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
            Legal
          </span>
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          >
            Cookie Policy
          </h1>
          <p className="text-lg" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            We use cookies to keep you signed in, remember your preferences, and
            improve the platform. Here is exactly what we use and why.
          </p>
          <p
            className="mt-3 text-xs"
            style={{ color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {cookieTypes.map((ct) => (
            <motion.div
              key={ct.name}
              variants={item}
              className="p-8 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2
                  className="text-xl"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
                >
                  {ct.name}
                </h2>
                <span
                  className="text-xs px-3 py-1 font-semibold uppercase tracking-widest whitespace-nowrap"
                  style={{
                    borderRadius: "999px",
                    background: ct.required ? "rgba(110,189,138,0.12)" : "rgba(232,220,192,0.08)",
                    color: ct.required ? "#6EBD8A" : "var(--muted)",
                    border: ct.required ? "1px solid rgba(110,189,138,0.2)" : "1px solid var(--border)",
                  }}
                >
                  {ct.required ? "Required" : "Optional"}
                </span>
              </div>
              <p className="mb-4" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                {ct.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {ct.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-xs px-3 py-1"
                    style={{
                      borderRadius: "999px",
                      background: "var(--surface-2)",
                      color: "var(--muted)",
                      border: "1px solid var(--border)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Managing cookies */}
        <motion.div
          className="p-8 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2
            className="text-xl mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          >
            Managing Your Cookies
          </h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            You can control or delete cookies through your browser settings at any
            time. Note that disabling strictly necessary cookies will prevent you
            from staying logged in. For questions about our cookie practices, contact{" "}
            <a href="mailto:privacy@loran.ng" style={{ color: "var(--highlight)" }}>
              privacy@loran.ng
            </a>
            .
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/privacy"
            className="text-sm transition-all"
            style={{ color: "var(--muted)" }}
          >
            ← Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm transition-all"
            style={{ color: "var(--muted)" }}
          >
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
