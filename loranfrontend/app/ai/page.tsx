"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProcessResult } from "../../lib/ai";
import EnhancedUploadForm from "../../components/AI/EnhancedUploadForm";
import ResultsPanel from "../../components/AI/ResultsPanel";
import TutorialGuide from "../../components/AI/TutorialGuide";
import { Sparkles, Info, BookOpen, Zap, Shield, Clock } from "lucide-react";

export default function AIPage() {
  const router = useRouter();
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is logged in as a client
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      const userStr = sessionStorage.getItem('user');
      
      if (!token || !userStr) {
        // Not logged in - redirect to login
        alert('Please login as a client to use AI Try-On');
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'client') {
          // Not a client - redirect to home
          alert('AI Try-On is only available for clients. Please signup as a client.');
          router.push('/signup');
          return;
        }
        
        // User is authorized
        setIsAuthorized(true);
        setIsChecking(false);
        
        // Check tutorial
        const seen = localStorage.getItem("ai-tutorial-seen");
        if (!seen) {
          setShowTutorial(true);
        }
      } catch (e) {
        alert('Session error. Please login again.');
        router.push('/login');
      }
    }
  }, [router]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("ai-tutorial-seen", "true");
    setHasSeenTutorial(true);
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("ai-tutorial-seen", "true");
    setHasSeenTutorial(true);
  };

  // Show loading state while checking authorization
  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600">
        <div className="text-white text-xl">Checking access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Vibrant Multi-layer Animated Background */}
      <div className="fixed inset-0 opacity-35">
        {/* Layer 1: Large blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        
        {/* Layer 2: Medium blobs */}
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-1000" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-3000" />
        
        {/* Layer 3: Small accent blobs */}
        <div className="absolute top-1/4 left-1/2 w-48 h-48 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mix-blend-screen filter blur-xl animate-blob animation-delay-5000" />
      </div>
      
      {/* Gradient Overlay for depth */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "linear-gradient(120deg, rgba(14,42,34,0.65), rgba(124,45,59,0.18), rgba(27,64,53,0.8))" }} />
      
      {/* Mesh gradient effect */}
      <div className="fixed inset-0 opacity-25 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.3) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(219, 39, 119, 0.3) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(251, 146, 60, 0.3) 0px, transparent 50%)
        `
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ border: "1px solid var(--border)", background: "rgba(232,220,192,0.10)", color: "var(--highlight)" }}>
            <Sparkles className="w-4 h-4" />
            AI-Powered Technology
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ color: "var(--text)", textShadow: "0 8px 35px rgba(0,0,0,0.45)", fontFamily: "'Playfair Display', serif" }}>
            Get Your Perfect Measurements
          </h1>
          <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: "var(--muted)" }}>
            Upload your photos and let our AI technology generate accurate body measurements in seconds
          </p>
          
          {/* Tutorial Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:scale-105 font-bold group"
            style={{ background: "var(--highlight)", color: "#0E2A22" }}
          >
            <BookOpen className="w-5 h-5 group-hover:rotate-12 transition" />
            How It Works
          </button>
        </motion.div>

        {/* Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Results in 5-10 seconds", gradient: "from-yellow-400 to-orange-500" },
            { icon: Shield, title: "100% Private", desc: "Photos never stored", gradient: "from-emerald-400 to-teal-500" },
            { icon: Clock, title: "24/7 Available", desc: "Measure anytime, anywhere", gradient: "from-blue-400 to-indigo-500" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
            >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "var(--surface-2)", color: "var(--highlight)" }}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
                <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl p-8 transition-shadow duration-300"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "var(--surface-2)", color: "var(--highlight)" }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Upload Photos</h2>
            </div>
            
            <EnhancedUploadForm onResult={setResult} />

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 p-4 rounded-xl flex items-start gap-3 shadow-sm"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--highlight)" }} />
                <div className="text-sm" style={{ color: "var(--text)" }}>
                <p className="font-semibold mb-1">Privacy Notice</p>
                  <p style={{ color: "var(--muted)" }}>
                  Your photos are processed securely and never stored on our servers. 
                  They're deleted immediately after processing.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl p-8 transition-shadow duration-300"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            {result ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "rgba(110,189,138,0.2)", color: "#6EBD8A" }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-white text-2xl font-bold"
                    >
                      ✓
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Your Results</h2>
                </div>
                <ResultsPanel 
                  measurements={result.measurements} 
                  metadata={result.metadata}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="w-32 h-32 mb-6 bg-gradient-to-br from-violet-300 via-fuchsia-300 to-pink-300 rounded-3xl flex items-center justify-center shadow-2xl"
                >
                  <Sparkles className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
                  Ready to Get Started?
                </h3>
                <p className="text-center max-w-md" style={{ color: "var(--muted)" }}>
                  Upload your photos and enter your height to receive accurate AI-generated measurements
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <div className="rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-bold mb-2">Why AI Measurements?</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Traditional measuring tapes can be inconsistent and difficult to use alone. 
              Our AI analyzes your photos using advanced computer vision to provide accurate, 
              reliable measurements every time.
            </p>
          </div>
          <div className="rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-bold mb-2">Perfect for Online Shopping</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Use your measurements to find perfectly fitting clothes online. 
              Share them with designers for custom creations or keep them saved for easy reference.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialGuide 
            onClose={handleCloseTutorial}
            onSkip={handleSkipTutorial}
          />
        )}
      </AnimatePresence>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          25% { 
            transform: translate(50px, -60px) scale(1.15) rotate(90deg);
            opacity: 0.9;
          }
          50% { 
            transform: translate(-30px, 40px) scale(0.85) rotate(180deg);
            opacity: 1;
          }
          75% { 
            transform: translate(40px, 50px) scale(1.05) rotate(270deg);
            opacity: 0.95;
          }
        }
        .animate-blob {
          animation: blob 10s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>
    </div>
  );
}
