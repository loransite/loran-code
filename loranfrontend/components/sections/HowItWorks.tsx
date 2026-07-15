"use client"
// components/sections/HowItWorks.tsx   ← note: "It" not "IT"
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/app/lib/animations";
// import { CheckCircleIcon } from "@heroicons/react/24/solid";

const steps = [
  { title: "Upload Your Design", desc: "Designers drop sketches or 3D models." },
  { title: "AI Virtual Try-On", desc: "Clients see the garment instantly." },
  { title: "Direct Chat & Order", desc: "Negotiate, customize, and pay securely." },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6" style={{ background: "var(--surface)" }}>
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-2xl sm:text-4xl md:text-5xl text-center mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          How Loran Works
        </motion.h2>
        <motion.p
          className="text-center mb-12 max-w-xl mx-auto"
          style={{ color: "var(--muted)" }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Three steps from idea to perfectly fitted garment.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-3 gap-6 md:gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="text-center p-5 md:p-8 rounded-2xl transition-all duration-300"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
              variants={fadeUp}
              whileHover={{ y: -3, boxShadow: "0 24px 60px rgba(0,0,0,0.3)", borderColor: "rgba(232,220,192,0.25)" }}
            >
              <div
                className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center text-xl font-bold"
                style={{ background: "var(--accent)", color: "var(--highlight)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                0{i + 1}
              </div>
              <h3
                className="text-xl mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
              >
                {step.title}
              </h3>
              <p style={{ color: "var(--muted)" }}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}