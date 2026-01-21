"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [preferredRole, setPreferredRole] = useState<string>("client");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        ...form,
        role: preferredRole
      });
      
      const data = res.data;
      
      // If server asks for role selection because user has many and didn't specify one that works
      if (data.availableRoles && data.availableRoles.length > 1 && !data.token) {
        setAvailableRoles(data.availableRoles);
        setShowRoleSelection(true);
      } else {
        login(data);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleLogin = async (role: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        ...form,
        role
      });
      
      login(res.data);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowRoleSelection(false);
    setAvailableRoles([]);
    setLoading(false);
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

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
      {!showRoleSelection ? (
        <motion.form
          onSubmit={handleInitialLogin}
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

          <div className="relative z-10 space-y-2">
            <label className="text-sm font-semibold text-gray-600">Login as:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="preferredRole" 
                  value="client" 
                  checked={preferredRole === "client"} 
                  onChange={() => setPreferredRole("client")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Client</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="preferredRole" 
                  value="designer" 
                  checked={preferredRole === "designer"} 
                  onChange={() => setPreferredRole("designer")}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm text-gray-700">Designer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="preferredRole" 
                  value="admin" 
                  checked={preferredRole === "admin"} 
                  onChange={() => setPreferredRole("admin")}
                  className="w-4 h-4 text-gray-600"
                />
                <span className="text-sm text-gray-700">Admin</span>
              </label>
            </div>
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
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </a>
          </p>

          <p className="text-sm text-center text-gray-600 relative z-10">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </p>
        </motion.form>
      ) : (
        <motion.div
          className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md space-y-6 relative overflow-hidden"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50 rounded-3xl" />
          <h2 className="text-3xl font-bold text-center text-gray-800 relative z-10">
            Select Your Role
          </h2>
          <p className="text-sm text-center text-gray-600 relative z-10">
            You have multiple roles. Choose how you want to login:
          </p>

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

          <div className="space-y-3 relative z-10">
            {availableRoles.map((role) => (
              <motion.button
                key={role}
                onClick={() => handleRoleLogin(role)}
                disabled={loading}
                className={`w-full py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                  role === 'admin' 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900' 
                    : role === 'designer' 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                } text-white`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {role === 'client' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                  {role === 'designer' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />}
                  {role === 'admin' && (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  )}
                </svg>
                <span className="font-semibold capitalize">Login as {role}</span>
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleBackToLogin}
            className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors relative z-10"
          >
            ← Back to Login
          </button>
        </motion.div>
      )}
    </div>
  );
}
