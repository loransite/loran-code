// components/hero/Hero.tsx
"use client"; // ← Framer Motion runs only on the client

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, staggerContainer, parallaxBg } from "@/app/lib/animations";
import Button from "@/components/ui/Button";

/* --------------------------------------------------------------
   Import the hero image – Next.js will optimise it automatically
   -------------------------------------------------------------- */
import heroBg from "@/public/images/Hero.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
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

      {/* ---- Dark overlay + gradient for readability ---- */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

      {/* ---- Content ---- */}
      <motion.div
        className="relative z-10 container mx-auto text-center px-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl"
          variants={fadeUp}
        >
          Design Meets{" "}
          <span className="bg-linear-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Client
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10"
          variants={fadeUp}
        >
          Loran bridges visionary designers with clients who love bespoke fashion.
          AI virtual try-on, direct chat, instant orders.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center"
          variants={fadeUp}
        >
          <Button href="/catalogue" variant="primary">
            Explore Designs
          </Button>
          <Button href="/designers" variant="secondary">
            Meet Designers
          </Button>
        </motion.div>

        {/* ---- Designer to Client connection line (optional) ---- */}
        <motion.div
          className="mt-16 flex justify-center items-center gap-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              D
            </div>
            <p className=" 
text-sm text-gray-300">Designer</p>
          </div>

          <motion.div
            className="w-32 h-1 bg-linear-to-r from-indigo-500 to-purple-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-linear-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              C
            </div>
            <p className="text-sm text-gray-300">Client</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}