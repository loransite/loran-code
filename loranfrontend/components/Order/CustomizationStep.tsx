"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";

type CustomizationStepProps = {
  onComplete: (data: { customizationRequest: string; clientNotes: string }) => void;
  onBack: () => void;
};

export default function CustomizationStep({ onComplete, onBack }: CustomizationStepProps) {
  const [customization, setCustomization] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (customization.trim()) {
      onComplete({
        customizationRequest: customization,
        clientNotes: notes,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            Customize Your Design
          </h2>
          <p className="text-gray-600">
            Tell us what tweaks or modifications you'd like on your design
          </p>
        </div>

        <div className="space-y-6">
          {/* Customization Request */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What changes would you like? *
            </label>
            <textarea
              value={customization}
              onChange={(e) => setCustomization(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="E.g., I want longer sleeves, different collar style, add pockets, change button color..."
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Any other details you'd like to share with the designer..."
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After submitting, our team will contact you to discuss your
              requirements in detail. Your order will then be assigned to the designer.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!customization.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
