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
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          How Loran Works
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} className="text-center" variants={fadeUp}>
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}