"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Camera, User, Ruler, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Take Front Photo",
    description: "Stand straight, facing the camera. Wear fitted clothing for accurate measurements.",
    image: "📸",
    tips: ["Arms slightly away from body", "Good lighting", "Full body visible"]
  },
  {
    icon: User,
    title: "Take Side Photo",
    description: "Turn 90 degrees to your right. Keep the same posture and distance from camera.",
    image: "🧍",
    tips: ["Same distance from camera", "Side profile visible", "Straight posture"]
  },
  {
    icon: Ruler,
    title: "Enter Your Height",
    description: "Input your accurate height to help calibrate the measurements.",
    image: "📏",
    tips: ["Measure without shoes", "Stand against a wall", "Use accurate measurement"]
  },
  {
    icon: CheckCircle2,
    title: "Generate Measurements",
    description: "Our AI will analyze your photos and provide accurate body measurements.",
    image: "✨",
    tips: ["Processing takes 5-10 seconds", "Results shown instantly", "Download or save"]
  }
];

export default function TutorialGuide({ onClose, onSkip }: { onClose: () => void; onSkip: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSkip();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">{step.image}</div>
            <h2 className="text-3xl font-bold mb-2">How to Use AI Measurements</h2>
            <p className="text-indigo-100">Step {currentStep + 1} of {steps.length}</p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Pro Tips:
                </h4>
                <ul className="space-y-2">
                  {step.tips.map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-indigo-600 mt-1">✓</span>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep
                    ? "w-8 bg-indigo-600"
                    : i < currentStep
                    ? "w-2 bg-indigo-400"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="flex-1 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-500/30"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </button>
            <button
              onClick={onSkip}
              className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:text-gray-800 transition"
            >
              Skip
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
