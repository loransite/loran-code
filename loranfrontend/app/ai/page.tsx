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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600">
      {/* Vibrant Multi-layer Animated Background */}
      <div className="fixed inset-0 opacity-40">
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
      <div className="fixed inset-0 bg-gradient-to-tr from-indigo-900/20 via-transparent to-pink-900/20 pointer-events-none" />
      
      {/* Mesh gradient effect */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white mb-4 shadow-lg hover:shadow-xl transition-shadow">
            <Sparkles className="w-4 h-4" />
            AI-Powered Technology
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            Get Your Perfect Measurements
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg font-medium">
            Upload your photos and let our AI technology generate accurate body measurements in seconds
          </p>
          
          {/* Tutorial Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white/95 backdrop-blur-md rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-105 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold group"
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
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
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
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30 hover:shadow-3xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Upload Photos</h2>
            </div>
            
            <EnhancedUploadForm onResult={setResult} />

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl flex items-start gap-3 shadow-sm"
            >
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Privacy Notice</p>
                <p className="text-blue-700">
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
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30 hover:shadow-3xl transition-shadow duration-300"
          >
            {result ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-white text-2xl font-bold"
                    >
                      ✓
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Your Results</h2>
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
                <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 text-center max-w-md">
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
          <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold mb-2">Why AI Measurements?</h3>
            <p className="text-blue-50 text-sm leading-relaxed">
              Traditional measuring tapes can be inconsistent and difficult to use alone. 
              Our AI analyzes your photos using advanced computer vision to provide accurate, 
              reliable measurements every time.
            </p>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold mb-2">Perfect for Online Shopping</h3>
            <p className="text-pink-50 text-sm leading-relaxed">
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
