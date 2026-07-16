"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { apiClient } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [preferredRole, setPreferredRole] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: { email: string; password: string; role?: string } = {
        ...form,
      };

      if (preferredRole) {
        payload.role = preferredRole;
      }

      const res = await apiClient.post('/api/auth/login', payload);
      
      const data = res.data;
      
      // If server asks for role selection because user has many and didn't specify one that works
      if (data.availableRoles && data.availableRoles.length > 1 && !data.token) {
        setAvailableRoles(data.availableRoles);
        setShowRoleSelection(true);
      } else {
        login(data);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string; availableRoles?: string[] }>;
      const roles = error.response?.data?.availableRoles;

      if (roles && roles.length > 1) {
        setAvailableRoles(roles);
        setShowRoleSelection(true);
        setError(error.response?.data?.message || "Select a role to continue");
      } else {
        setError(error.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleLogin = async (role: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await apiClient.post('/api/auth/login', {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg)" }}>
      {!showRoleSelection ? (
        <motion.form
          onSubmit={handleInitialLogin}
          className="w-full max-w-md space-y-6 relative overflow-hidden p-8 sm:p-10 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(232,220,192,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,220,192,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <h2 className="text-2xl sm:text-3xl text-center relative z-10" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}>
            Welcome Back
          </h2>
          {process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_BACKEND_URL && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2 text-center relative z-10">
              Backend URL missing. Using http://localhost:5000. Set NEXT_PUBLIC_BACKEND_URL in .env.local and restart dev.
            </p>
          )}

          {error && (
            <motion.p
              className="text-sm text-center relative z-10 status-error"
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
              className="w-full p-3 transition-all rounded-lg relative z-10"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
              variants={inputVariants}
              initial="initial"
              whileFocus="focus"
            />
            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 pr-12 transition-all rounded-lg"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
                variants={inputVariants}
                initial="initial"
                whileFocus="focus"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 transition-all"
                style={{ color: "var(--muted)" }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="relative z-10 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Login as:</label>
            <div className="flex gap-3 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="preferredRole"
                  value=""
                  checked={preferredRole === ""}
                  onChange={() => setPreferredRole("")}
                  className="w-4 h-4"
                  style={{ accentColor: "var(--highlight)" }}
                />
                <span className="text-sm" style={{ color: "var(--muted)" }}>Auto</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="preferredRole" 
                  value="client" 
                  checked={preferredRole === "client"} 
                  onChange={() => setPreferredRole("client")}
                  className="w-4 h-4"
                  style={{ accentColor: "var(--highlight)" }}
                />
                <span className="text-sm" style={{ color: "var(--muted)" }}>Client</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="preferredRole" 
                  value="designer" 
                  checked={preferredRole === "designer"} 
                  onChange={() => setPreferredRole("designer")}
                  className="w-4 h-4"
                  style={{ accentColor: "var(--highlight)" }}
                />
                <span className="text-sm" style={{ color: "var(--muted)" }}>Designer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="preferredRole" 
                  value="admin" 
                  checked={preferredRole === "admin"} 
                  onChange={() => setPreferredRole("admin")}
                  className="w-4 h-4"
                  style={{ accentColor: "var(--highlight)" }}
                />
                <span className="text-sm" style={{ color: "var(--muted)" }}>Admin</span>
              </label>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold transition-all relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(232,220,192,0.25)" }}
            whileTap={{ scale: 0.97 }}
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

          <p className="text-sm text-center relative z-10" style={{ color: "var(--muted)" }}>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-semibold" style={{ color: "var(--highlight)" }}>
              Sign Up
            </a>
          </p>

          <p className="text-sm text-center relative z-10">
            <a href="/forgot-password" className="transition-all" style={{ color: "var(--muted)" }}>
              Forgot Password?
            </a>
          </p>
        </motion.form>
      ) : (
        <motion.div
          className="w-full max-w-md space-y-6 relative overflow-hidden p-8 sm:p-10 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(232,220,192,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,220,192,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <h2 className="text-2xl sm:text-3xl text-center relative z-10" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}>
            Select Your Role
          </h2>
          <p className="text-sm text-center relative z-10" style={{ color: "var(--muted)" }}>
            You have multiple roles. Choose how you want to login:
          </p>

          {error && (
            <motion.p
              className="text-sm text-center relative z-10 status-error"
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
                className="w-full py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold capitalize"
                style={{ background: role === 'admin' ? 'var(--accent)' : role === 'designer' ? 'var(--surface-2)' : 'var(--highlight)', color: role === 'admin' ? 'var(--highlight)' : role === 'designer' ? 'var(--text)' : '#0E2A22', border: '1px solid var(--border)' }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(232,220,192,0.1)" }}
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
            className="w-full py-2 text-sm transition-all relative z-10"
            style={{ color: "var(--muted)" }}
          >
            ← Back to Login
          </button>
        </motion.div>
      )}
    </div>
  );
}
