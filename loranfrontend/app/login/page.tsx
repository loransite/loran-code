"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion"; // Import Variants type

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "designer") {
        router.push("/dashboard/designer");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Explicitly type formVariants as Variants
  const formVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }, // Use 'as const' to narrow string literal
    },
  };

  // Explicitly type inputVariants as Variants
  const inputVariants: Variants = {
    initial: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    focus: {
      scale: 1.02,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md space-y-6 relative overflow-hidden"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50 rounded-3xl" />
        <h2 className="text-3xl font-bold text-center text-gray-800 relative z-10">
          Welcome Back
        </h2>

        {error && (
          <motion.p
            className="text-red-500 text-sm text-center relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        <div className="space-y-4">
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-300 relative z-10"
            variants={inputVariants}
            initial="initial"
            whileFocus="focus"
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-300 relative z-10"
            variants={inputVariants}
            initial="initial"
            whileFocus="focus"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </motion.button>

        <p className="text-sm text-center text-gray-600 relative z-10">
          Don’t have an account?{" "}
          <motion.span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/signup")}
            whileHover={{ scale: 1.1 }}
          >
            Sign up
          </motion.span>
        </p>
      </motion.form>
    </div>
  );
}