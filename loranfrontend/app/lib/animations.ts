 // lib/animations.ts
import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export const slideInLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.7 } },
};

export const slideInRight: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.7 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const parallaxBg: Variants = {
  hidden: { scale: 1.15 },
  visible: {
    scale: 1,
    transition: { duration: 1.8, ease: "easeOut" },
  },
};

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut", delay: 0.8 },
  },
};

export const buttonHover: Variants = {
  hover: {
    scale: 1.06,
    boxShadow: "0px 10px 25px rgba(79, 70, 229, 0.3)",
    transition: { type: "spring", stiffness: 400 },
  },
  tap: { scale: 0.95 },
};

export const floatCTA: Variants = {
  hover: {
    y: [-4, -8, -4],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",   // ← fixed
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

export const cardLift: Variants = {
  hover: { y: -10, transition: { duration: 0.3 } },
};

export const imageZoom: Variants = {
  hover: { scale: 1.1, transition: { duration: 0.5 } },
};

export const scrollFadeUp: Variants = {
  offscreen: { opacity: 0, y: 50 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};
export const stagger: Variants = {
  show: { transition: { staggerChildren: 0.08 } },
};

export const scrollStagger: Variants = {
  offscreen: {},
  onscreen: {
    transition: { staggerChildren: 0.15 },
  },
};