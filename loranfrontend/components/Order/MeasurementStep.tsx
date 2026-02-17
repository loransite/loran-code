"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler, Upload, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type MeasurementStepProps = {
  onComplete: (data: { hasMeasurements: boolean; method: "ai" | "manual"; measurements?: any }) => void;
  designItem: { id: string; name: string; imageUrl: string; price: number };
};

export default function MeasurementStep({ onComplete, designItem }: MeasurementStepProps) {
  const [hasMeasurements, setHasMeasurements] = useState<boolean | null>(null);
  const [measurements, setMeasurements] = useState({
    height: "",
    chest: "",
    waist: "",
    hips: "",
    shoulder: "",
    sleeveLength: "",
    inseam: "",
  });

  const handleManualSubmit = () => {
    onComplete({
      hasMeasurements: true,
      method: "manual",
      measurements: {
        height: parseFloat(measurements.height),
        chest: parseFloat(measurements.chest),
        waist: parseFloat(measurements.waist),
        hips: parseFloat(measurements.hips),
        shoulder: parseFloat(measurements.shoulder),
        sleeveLength: parseFloat(measurements.sleeveLength),
        inseam: parseFloat(measurements.inseam),
      },
    });
  };

  const handleAIRedirect = () => {
    // Store design info in sessionStorage for after AI measurement
    sessionStorage.setItem("orderDesign", JSON.stringify(designItem));
    window.location.href = "/ai?returnTo=order";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order: {designItem.name}</h2>
          <p className="text-gray-600">Let's get your measurements for the perfect fit</p>
        </div>

        {/* Question: Do you have measurements? */}
        {hasMeasurements === null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Do you have your body measurements?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setHasMeasurements(true)}
                className="p-6 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition-all group"
              >
                <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-lg mb-2">Yes, I have them</h4>
                <p className="text-sm text-gray-600">Enter your measurements manually</p>
              </button>
              <button
                onClick={() => setHasMeasurements(false)}
                className="p-6 border-2 border-purple-500 rounded-xl hover:bg-purple-50 transition-all group"
              >
                <Upload className="w-12 h-12 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-lg mb-2">No, I don't</h4>
                <p className="text-sm text-gray-600">Use our AI try-on measurement tool</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* Manual measurement input */}
        {hasMeasurements === true && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Ruler className="w-6 h-6" />
              Enter Your Measurements (in inches)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(measurements).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={value}
                    onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 36.5"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setHasMeasurements(null)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleManualSubmit}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* AI Try-On Recommendation */}
        {hasMeasurements === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-center"
          >
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
              <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Get AI-Powered Measurements
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Our AI measurement tool uses your photos to generate accurate body measurements.
                Simply upload a front and side photo along with your height, and we'll do the rest!
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleAIRedirect}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all text-lg font-semibold"
                >
                  Use AI Try-On Measurement
                </button>
                <button
                  onClick={() => setHasMeasurements(null)}
                  className="block mx-auto px-6 py-2 text-gray-600 hover:text-gray-900"
                >
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
