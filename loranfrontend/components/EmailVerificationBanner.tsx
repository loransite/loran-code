'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/lib/api';

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  // Don't show if user is verified or banner is dismissed
  if (!user || user.isEmailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    try {
      setResending(true);
      await apiClient.post('/auth/resend-verification', { email: user.email });
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white overflow-hidden"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Verify your email address</p>
                <p className="text-sm text-white/90">
                  Check your inbox for a verification link to unlock all features.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {resent ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Email sent!</span>
                </motion.div>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">
                    {resending ? 'Sending...' : 'Resend'}
                  </span>
                </button>
              )}

              <button
                onClick={() => setDismissed(true)}
                className="p-2 hover:bg-white/20 rounded-full transition-all"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
