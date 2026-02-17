"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    setLoading(true);
    setError("");

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

      if (res.data.status === 'pending') {
        alert(res.data.message);
        router.push("/login");
        return;
      }

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.setItem("activeRole", res.data.user.activeRole);
      sessionStorage.setItem("availableRoles", JSON.stringify(res.data.availableRoles || []));

      // Show success message
      alert(`✅ Account created successfully! Welcome, ${res.data.user.fullName}!`);

      // Redirect based on active role
      const activeRole = res.data.user.activeRole;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md space-y-4 relative overflow-hidden"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50 rounded-3xl" />
        <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <motion.input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50"
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
          className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50"
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
            className="w-full border border-gray-200 rounded-lg p-3 pr-20 bg-gray-50"
            variants={inputVariants}
            initial="initial"
            whileFocus="focus"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white/70 px-3 py-1 rounded-full shadow"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Role Selection - Multi-select */}
        <div className="space-y-2">
          <label className="font-semibold text-sm text-gray-700">I want to:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.roles.includes('client')}
                onChange={() => handleRoleToggle('client')}
                className="w-4 h-4 text-purple-600"
              />
              <span>Buy Designs (Client)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.roles.includes('designer')}
                onChange={() => handleRoleToggle('designer')}
                className="w-4 h-4 text-purple-600"
              />
              <span>Sell Designs (Designer)</span>
            </label>
          </div>
          {form.roles.length === 0 && (
            <p className="text-xs text-red-500">Please select at least one option</p>
          )}
        </div>

        {/* Profile Picture */}
        <div>
          <label className="text-sm text-gray-600">Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleFile} className="w-full mt-1" />
        </div>

        {/* Client-specific fields */}
        {form.roles.includes('client') && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-sm text-gray-700">Client Information</h3>

            <div>
              <label className="text-sm text-gray-600">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="e.g., 170"
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">BMI (optional)</label>
              <input
                type="number"
                step="0.1"
                name="bmi"
                value={form.bmi}
                onChange={handleChange}
                placeholder="e.g., 22.5"
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          </div>
        )}

        {/* Designer-specific fields */}
        {form.roles.includes('designer') && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-sm text-gray-700">Designer Information</h3>

            <input
              type="text"
              name="brandName"
              value={form.brandName}
              onChange={handleChange}
              placeholder="Brand/Business Name"
              className="w-full border rounded-lg p-2"
            />

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full border rounded-lg p-2"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="border rounded-lg p-2"
              />
            </div>

            <input
              type="text"
              name="shopAddress"
              value={form.shopAddress}
              onChange={handleChange}
              placeholder="Shop/Studio Address (optional)"
              className="w-full border rounded-lg p-2"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-600">Years of Experience</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={form.yearsExperience}
                  onChange={handleChange}
                  min={0}
                  placeholder="e.g., 5"
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Expertise Level</label>
                <select
                  name="expertiseLevel"
                  value={form.expertiseLevel}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 mt-1"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Short Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself and your design style..."
                className="w-full border rounded-lg p-2 mt-1"
                rows={3}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Log in
          </span>
        </p>
      </motion.form>
    </div>
  );
}