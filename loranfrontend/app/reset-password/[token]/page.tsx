'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`,
        { token, newPassword }
      );
      setMessage('Password reset successfully! Redirecting to login...');
      setNewPassword('');
      setConfirmPassword('');
      // Redirect to login after 2 seconds
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err?.response?.data?.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center mt-20" style={{ background: "var(--bg)" }}>
        <div className="max-w-md w-full p-8 rounded-2xl text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
          <h1 className="text-2xl mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#F87171" }}>Invalid Link</h1>
          <p className="mb-6" style={{ color: "var(--muted)" }}>This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="font-semibold" style={{ color: "var(--highlight)" }}>Request a new reset link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center mt-20">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-8 rounded-2xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
      >
        <h1 className="text-3xl text-center mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}>Reset Password</h1>
        <p className="text-center mb-6" style={{ color: "var(--muted)" }}>Enter your new password below.</p>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-3 rounded-lg mb-6 text-sm"
            style={{ background: "rgba(110,189,138,0.1)", border: "1px solid rgba(110,189,138,0.25)", color: "#6EBD8A" }}
          >
            {message}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-3 rounded-lg mb-6 text-sm"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#F87171" }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>New Password</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Confirm Password</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg transition-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }} placeholder="••••••••" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p style={{ color: "var(--muted)" }}>
            <Link href="/login" className="font-semibold" style={{ color: "var(--highlight)" }}>Back to Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
