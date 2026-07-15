'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      );
      // If the backend returned a token or url (development mode), show it to the user
      if (response.data?.resetUrl || response.data?.resetToken) {
        const display = response.data.resetUrl || `${window.location.origin}/reset-password/${response.data.resetToken}`;
        setResetUrl(display);
        setMessage('Reset link generated (development). Use the link below to reset your password:');
      } else {
        setMessage('Reset link sent to your email. Check your inbox.');
        // Redirect to login after 3 seconds
        setTimeout(() => router.push('/login'), 3000);
      }
      setEmail('');
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err?.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center mt-20" style={{ background: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-8 rounded-2xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
      >
        <h1 className="text-3xl text-center mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}>Forgot Password?</h1>
        <p className="text-center mb-6" style={{ color: "var(--muted)" }}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-3 rounded-lg mb-6 text-sm"
            style={{ background: "rgba(110,189,138,0.1)", border: "1px solid rgba(110,189,138,0.25)", color: "#6EBD8A" }}
          >
            <div className="space-y-2">
              <div>{message}</div>
              {resetUrl && (
                <div className="mt-2 flex items-center justify-between">
                  <a href={resetUrl} className="underline break-all" style={{ color: "var(--highlight)" }} target="_blank" rel="noreferrer">
                    {resetUrl}
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(resetUrl)}
                    className="ml-4 px-3 py-1 rounded text-xs font-semibold transition-all"
                    style={{ background: "var(--highlight)", color: "#0E2A22" }}
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
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
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg transition-all"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
              placeholder="your@email.com"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p style={{ color: "var(--muted)" }}>
            Remember your password?{' '}
            <Link href="/login" className="font-semibold" style={{ color: "var(--highlight)" }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
