'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, Loader2, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = params.token;
        
        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link');
          return;
        }

        const response = await apiClient.get(`/api/auth/verify-email/${token}`);
        
        if (response.data.alreadyVerified) {
          setStatus('already-verified');
          setMessage('Your email is already verified!');
        } else {
          setStatus('success');
          setMessage(response.data.message || 'Email verified successfully!');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Verification failed. The link may be expired or invalid.'
        );
      }
    };

    verifyEmail();
  }, [params.token]);

  // Countdown for redirect
  useEffect(() => {
    if (status === 'success' || status === 'already-verified') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, router]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-24 h-24 text-purple-500 animate-spin" />;
      case 'success':
      case 'already-verified':
        return <CheckCircle className="w-24 h-24 text-green-500" />;
      case 'error':
        return <XCircle className="w-24 h-24 text-red-500" />;
    }
  };

  const getGradient = () => {
    switch (status) {
      case 'success':
      case 'already-verified':
        return 'from-green-400 via-emerald-500 to-teal-600';
      case 'error':
        return 'from-red-400 via-rose-500 to-pink-600';
      default:
        return 'from-purple-400 via-pink-500 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-20`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            {getIcon()}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {status === 'loading' && 'Verifying Email'}
            {status === 'success' && 'Email Verified! 🎉'}
            {status === 'already-verified' && 'Already Verified ✓'}
            {status === 'error' && 'Verification Failed'}
          </motion.h1>

          {/* Message */}
          <motion.p
            className="text-white/80 text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {message}
          </motion.p>

          {/* Actions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {(status === 'success' || status === 'already-verified') && (
              <>
                <div className="text-center text-white/60 text-sm">
                  Redirecting to dashboard in {countdown} seconds...
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                >
                  Sign Up Again
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all border border-white/20"
                >
                  Go to Login
                </button>
              </>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-8 text-center text-white/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Having trouble? Contact support@loran.com
          </motion.div>
        </div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
