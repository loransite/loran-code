"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    roles: ["client"], // Changed to array
    // Client fields
    height: "",
    bmi: "",
    // Designer fields
    brandName: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    shopAddress: "",
    yearsExperience: "",
    expertiseLevel: "intermediate",
    bio: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (role: string) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.roles.length === 0) {
      setError("Please select at least one role (client or designer)");
      return;
    }

    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('fullName', form.fullName);
      fd.append('email', form.email);
      fd.append('password', form.password);
      fd.append('roles', JSON.stringify(form.roles));
      
      if (profilePicture) fd.append('profilePicture', profilePicture);
      
      // Add fields for both roles if selected
      if (form.roles.includes('client')) {
        if (form.height) fd.append('height', form.height);
        if (form.bmi) fd.append('bmi', form.bmi);
      }
      
      if (form.roles.includes('designer')) {
        if (form.brandName) fd.append('brandName', form.brandName);
        if (form.phone) fd.append('phone', form.phone);
        if (form.city) fd.append('city', form.city);
        if (form.state) fd.append('state', form.state);
        if (form.country) fd.append('country', form.country);
        if (form.shopAddress) fd.append('shopAddress', form.shopAddress);
        if (form.yearsExperience) fd.append('yearsExperience', form.yearsExperience);
        if (form.expertiseLevel) fd.append('expertiseLevel', form.expertiseLevel);
        if (form.bio) fd.append('bio', form.bio);
      }

      const res = await apiClient.post('/api/auth/signup', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // If signup created a pending designer application, backend may return status
      if (res.data.status === 'pending') {
        alert(res.data.message);
        // If backend included user and availableRoles, persist them for later
        if (res.data.user) {
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
        }
        if (res.data.availableRoles) {
          sessionStorage.setItem("availableRoles", JSON.stringify(res.data.availableRoles));
        }
        router.push("/login");
        return;
      }

      // Normal flow: store token and user
      if (res.data.token) sessionStorage.setItem("token", res.data.token);
      if (res.data.user) {
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        sessionStorage.setItem("activeRole", res.data.user.activeRole || (res.data.availableRoles && res.data.availableRoles[0]) || 'client');
      }
      sessionStorage.setItem("availableRoles", JSON.stringify(res.data.availableRoles || []));

      // Show success message
      alert(`✅ Account created successfully! Welcome, ${res.data.user?.fullName || 'New User'}!`);

      // Redirect based on active role
      const activeRole = (res.data.user && res.data.user.activeRole) || (res.data.availableRoles && res.data.availableRoles[0]) || 'client';
      if (activeRole === "designer") {
        router.push("/dashboard/designer");
      } else if (activeRole === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Signup failed";
        setError(msg);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const inputVariants: Variants = {
    initial: { scale: 1 },
    focus: { scale: 1.02, transition: { duration: 0.25 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg)" }}>
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 relative overflow-hidden p-8 sm:p-10 rounded-2xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
        variants={formVariants}
        initial="hidden"
        animate="visible"
            >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(232,220,192,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,220,192,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <h2 className="text-2xl sm:text-3xl text-center relative z-10" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}>Create an Account</h2>

        {error && <p className="text-sm relative z-10" style={{ color: "#F87171" }}>{error}</p>}

        <motion.input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          className="w-full p-3 transition-all rounded-lg relative z-10"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
          variants={inputVariants}
          initial="initial"
          whileFocus="focus"
        />

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
            minLength={8}
            className="w-full p-3 pr-12 transition-all rounded-lg relative z-10"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
            variants={inputVariants}
            initial="initial"
            whileFocus="focus"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all"
            style={{ color: "var(--muted)" }}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          <motion.input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full p-3 pr-12 transition-all rounded-lg relative z-10"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
            variants={inputVariants}
            initial="initial"
            whileFocus="focus"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(v => !v)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all"
            style={{ color: "var(--muted)" }}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {confirmPassword && form.password !== confirmPassword && (
          <p className="text-xs" style={{ color: "#F87171" }}>Passwords do not match</p>
        )}

        {/* Role Selection - Multi-select */}
        <div className="space-y-2">
          <label className="font-semibold text-xs uppercase tracking-widest relative z-10" style={{ color: "var(--muted)" }}>I want to:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.roles.includes('client')}
                onChange={() => handleRoleToggle('client')}
                className="w-4 h-4"
                style={{ accentColor: "var(--highlight)" }}
              />
              <span className="text-sm" style={{ color: "var(--muted)" }}>Buy Designs (Client)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.roles.includes('designer')}
                onChange={() => handleRoleToggle('designer')}
                className="w-4 h-4"
                style={{ accentColor: "var(--highlight)" }}
              />
              <span className="text-sm" style={{ color: "var(--muted)" }}>Sell Designs (Designer)</span>
            </label>
          </div>
          {form.roles.length === 0 && (
            <p className="text-xs" style={{ color: "#F87171" }}>Please select at least one option</p>
          )}
        </div>

        {/* Profile Picture */}
        <div>
          <label className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleFile} className="w-full mt-1" style={{ color: "var(--muted)" }} />
        </div>

        {/* Client-specific fields */}
        {form.roles.includes('client') && (
          <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: "var(--highlight)" }}>Client Information</h3>

            <div>
              <label className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="e.g., 170"
                className="w-full p-2 mt-1 rounded-lg transition-all"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>BMI (optional)</label>
              <input
                type="number"
                step="0.1"
                name="bmi"
                value={form.bmi}
                onChange={handleChange}
                placeholder="e.g., 22.5"
                className="w-full p-2 mt-1 rounded-lg transition-all"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
              />
            </div>
          </div>
        )}

        {/* Designer-specific fields */}
        {form.roles.includes('designer') && (
          <div className="space-y-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold text-xs uppercase tracking-widest" style={{ color: "var(--highlight)" }}>Designer Information</h3>

            <input type="text" name="brandName" value={form.brandName} onChange={handleChange} placeholder="Brand/Business Name" className="w-full p-2 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full p-2 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className="p-2 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} />
              <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State" className="p-2 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} />
              <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="Country" className="p-2 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} />
            </div>
            <input type="text" name="shopAddress" value={form.shopAddress} onChange={handleChange} placeholder="Shop/Studio Address (optional)" className="w-full p-2 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Years of Experience</label>
                <input type="number" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} min={0} placeholder="e.g., 5" className="w-full p-2 mt-1 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Expertise Level</label>
                <select name="expertiseLevel" value={form.expertiseLevel} onChange={handleChange} className="w-full p-2 mt-1 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Short Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself and your design style..."
                className="w-full p-2 mt-1 rounded-lg transition-all"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
                rows={3}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-semibold transition-all relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-sm text-center relative z-10" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <span
            className="font-semibold cursor-pointer"
            style={{ color: "var(--highlight)" }}
            onClick={() => router.push("/login")}
          >
            Log in
          </span>
        </p>
      </motion.form>
    </div>
  );
}