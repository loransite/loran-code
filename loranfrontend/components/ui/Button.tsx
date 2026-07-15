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
  const base =
    "inline-flex items-center justify-center px-7 py-3.5 font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DCC0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E2A22]";

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--highlight)",
      color: "#0E2A22",
      borderRadius: "3px",
      border: "1px solid var(--border)",
      fontWeight: 600,
    },
    secondary: {
      background: "transparent",
      color: "var(--text)",
      borderRadius: "3px",
      border: "1px solid var(--border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--muted)",
      borderRadius: "3px",
      border: "none",
    },
  };

  return (
    <motion.a
      className={`${base} ${className}`}
      style={styles[variant]}
      whileHover={
        variant === "primary"
          ? { scale: 1.02, y: -1, boxShadow: "0 0 40px rgba(232,220,192,0.25)" }
          : { scale: 1.02 }
      }
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}