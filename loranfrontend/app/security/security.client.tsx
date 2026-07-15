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

const practices = [
  {
    icon: "🔐",
    title: "Password Security",
    desc: "All passwords are hashed with bcrypt before storage. We never store plaintext credentials. Password reset flows use short-lived signed tokens sent to your verified email.",
  },
  {
    icon: "🛡️",
    title: "Authentication & Sessions",
    desc: "We use JWT-based authentication with short expiry windows. Tokens are signed server-side and validated on every protected request. Role-based access control (RBAC) enforces permissions across client, designer, and admin roles.",
  },
  {
    icon: "💳",
    title: "Payment Security",
    desc: "Payments are processed exclusively through Paystack, a PCI-DSS compliant provider. Loran never stores card numbers, CVVs, or raw payment credentials. All transactions are verified server-side before order confirmation.",
  },
  {
    icon: "🔒",
    title: "Data Encryption",
    desc: "All data in transit is encrypted via HTTPS/TLS 1.3. Sensitive fields in our database are encrypted at rest. We follow the principle of least privilege for all data access.",
  },
  {
    icon: "📁",
    title: "File & Media Uploads",
    desc: "Designer uploads and AI measurement photos are processed and stored via Cloudinary with signed URLs. User-uploaded files are validated for type and size before acceptance.",
  },
  {
    icon: "🚨",
    title: "Incident Response",
    desc: "We maintain an internal incident response plan. In the event of a breach, affected users will be notified within 72 hours via email with instructions. We conduct regular internal security reviews.",
  },
];

export default function SecurityClient() {
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
              background: "rgba(110,189,138,0.08)",
              color: "#6EBD8A",
              letterSpacing: "0.1em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6EBD8A" }} />
            All Systems Operational
          </span>
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          >
            Security at Loran
          </h1>
          <p className="text-lg" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Your account, data, and payments are protected by industry-standard
            security practices at every layer of our platform.
          </p>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Practices grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-16"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {practices.map((p) => (
            <motion.div
              key={p.title}
              variants={item}
              className="p-8 rounded-2xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              }}
              whileHover={{ y: -3, borderColor: "rgba(232,220,192,0.25)" }}
            >
              <span className="text-2xl mb-4 block">{p.icon}</span>
              <h2
                className="text-lg mb-3"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
              >
                {p.title}
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Responsible disclosure */}
        <motion.div
          className="p-10 rounded-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
        >
          <h2
            className="text-2xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          >
            Responsible Disclosure
          </h2>
          <p className="mb-6" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Found a vulnerability? We appreciate responsible disclosure. Please
            send a detailed report to our security team. Do not publicly disclose
            the issue until we have had a chance to investigate and patch it. We
            aim to acknowledge all valid reports within 48 hours.
          </p>
          <a
            href="mailto:security@loran.ng"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all"
            style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
          >
            Report a Vulnerability
          </a>
        </motion.div>

        <div className="text-center">
          <Link href="/" className="text-sm transition-all" style={{ color: "var(--muted)" }}>
            ← Back to Loran
          </Link>
        </div>
      </div>
    </div>
  );
}
