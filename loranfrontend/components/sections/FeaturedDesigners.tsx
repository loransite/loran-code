"use client"
// components/sections/FeaturedDesigners.tsx
import { motion } from "framer-motion";
import { fadeUp, cardLift, imageZoom } from "@/app/lib/animations";
import Image from "next/image";

const designers = [
  { name: "Aria Voss", specialty: "Evening Wear", img: "/images/designer-1.jpg" },
  { name: "Leo Chen", specialty: "Street Couture", img: "/images/designer-2.jpg" },
  { name: "Sofia Reyes", specialty: "Sustainable Fashion", img: "/images/designer-3.jpg" },
];

export default function FeaturedDesigners() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Featured Designers
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {designers.map((d, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              variants={cardLift}
              whileHover="hover"
            >
              <Image
                src={d.img}
                alt={d.name}
                width={400}
                height={500}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white"
                variants={imageZoom}
                whileHover="hover"
              >
                <h3 className="text-xl font-bold">{d.name}</h3>
                <p className="text-sm">{d.specialty}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}