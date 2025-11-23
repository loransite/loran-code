// components/ui/Button.tsx
import { motion, MotionProps } from "framer-motion";

type Props = React.ComponentPropsWithoutRef<"a"> &
  MotionProps & {
    variant?: "primary" | "secondary" | "ghost";
  };

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: Props) {
  const base = "inline-flex items-center justify-center rounded-full px-7 py-3.5 font-semibold transition-all duration-300";

  const styles = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl",
    secondary: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
    ghost: "text-gray-700 hover:text-indigo-600",
  };

  return (
    <motion.a
      className={`${base} ${styles[variant]} ${className}`}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}