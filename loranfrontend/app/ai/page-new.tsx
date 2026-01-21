"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProcessResult } from "../../lib/ai";
import EnhancedUploadForm from "../../components/AI/EnhancedUploadForm";
import ResultsPanel from "../../components/AI/ResultsPanel";
import TutorialGuide from "../../components/AI/TutorialGuide";
import { Sparkles, Info, BookOpen, Zap, Shield, Clock } from "lucide-react";

export default function AIPage() {
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial before
    const seen = localStorage.getItem("ai-tutorial-seen");
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-600 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4" />
            AI-Powered Technology
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Get Your Perfect Measurements
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your photos and let our AI technology generate accurate body measurements in seconds
          </p>
          
          {/* Tutorial Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition text-indigo-600 font-medium group"
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
            { icon: Zap, title: "Lightning Fast", desc: "Results in 5-10 seconds" },
            { icon: Shield, title: "100% Private", desc: "Photos never stored" },
            { icon: Clock, title: "24/7 Available", desc: "Measure anytime, anywhere" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 shadow-lg"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
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
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Photos</h2>
            </div>
            
            <EnhancedUploadForm onResult={setResult} />

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3"
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
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            {result ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      ✓
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Results</h2>
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
                  className="w-32 h-32 mb-6 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-3xl flex items-center justify-center"
                >
                  <Sparkles className="w-16 h-16 text-indigo-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
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
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Why AI Measurements?</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Traditional measuring tapes can be inconsistent and difficult to use alone. 
              Our AI analyzes your photos using advanced computer vision to provide accurate, 
              reliable measurements every time.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Perfect for Online Shopping</h3>
            <p className="text-purple-100 text-sm leading-relaxed">
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
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
