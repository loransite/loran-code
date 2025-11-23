// components/ui/FloatingCTA.tsx
import { motion } from "framer-motion";
import { floatCTA } from "@/lib/animations";
import Button from "./Button";

export default function FloatingCTA() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      variants={floatCTA}
      whileHover="hover"
    >
      <Button href="/signup" variant="primary">
        Get Started
      </Button>
    </motion.div>
  );
}