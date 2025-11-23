"use client"
// components/sections/Testimonials.tsx
import { motion } from "framer-motion";
import { fadeUp } from "@/app/lib/animations";
import { StarIcon } from "@heroicons/react/24/solid";

const quotes = [
  { text: "Loran turned my sketch into a client-ready masterpiece in 48h!", author: "Isabella M." },
  { text: "The AI try-on saved me 3 fittings. Incredible!", author: "James K." },
  { text: "Finally a platform that pays designers fairly.", author: "Nia O." },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Loved by Designers & Clients
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, s) => (
                  <StarIcon key={s} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">&quot;{q.text}&quot;</p>
              <p className="font-semibold text-indigo-600">— {q.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}