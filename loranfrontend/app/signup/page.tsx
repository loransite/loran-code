"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "client", // default role
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [yearsExperience, setYearsExperience] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use FormData so designers can upload avatar and provide yearsExperience
      const fd = new FormData();
      fd.append('fullName', form.fullName);
      fd.append('email', form.email);
      fd.append('password', form.password);
      fd.append('role', form.role);
      if (avatar) fd.append('avatar', avatar);
      if (form.role === 'designer') {
        fd.append('yearsExperience', yearsExperience);
        fd.append('bio', bio);
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Save user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (form.role === "designer") {
        router.push("/dashboard/designer");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Signup failed");
      } else {
        setError("Unexpected error occurred");
      }
    }
  }; // Semicolon added

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="client">Client</option>
          <option value="designer">Designer</option>
        </select>

        {form.role === 'designer' && (
          <div className="space-y-2">
            <label className="text-sm">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFile} className="w-full" />

            <label className="text-sm">Years of Experience</label>
            <input
              type="number"
              min={0}
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <label className="text-sm">Short Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border rounded-lg p-2"
              rows={3}
            />
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
      </form>
    </div>
  );
}