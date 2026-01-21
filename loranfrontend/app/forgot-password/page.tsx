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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center mt-20">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-2">Forgot Password?</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6"
          >
            <div className="space-y-2">
              <div>{message}</div>
              {resetUrl && (
                <div className="mt-2 flex items-center justify-between">
                  <a href={resetUrl} className="text-indigo-600 underline break-all" target="_blank" rel="noreferrer">
                    {resetUrl}
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(resetUrl)}
                    className="ml-4 bg-indigo-600 text-white px-3 py-1 rounded"
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
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              placeholder="your@email.com"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
