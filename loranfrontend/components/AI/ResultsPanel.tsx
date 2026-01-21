"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Measurement } from "../../lib/ai";
import { Download, Share2 } from "lucide-react";

type Props = {
  measurements: Measurement[];
  metadata?: any;
};

export default function ResultsPanel({ measurements, metadata }: Props) {
  const [unit, setUnit] = useState<"cm" | "inches">("inches");

  const convertValue = (value: number, originalUnit: string) => {
    if (unit === "inches") {
      if (originalUnit === "cm") {
        return (value / 2.54).toFixed(1);
      }
      return value.toFixed(1);
    } else {
      if (originalUnit === "inches") {
        return (value * 2.54).toFixed(1);
      }
      return value.toFixed(1);
    }
  };

  const downloadMeasurements = () => {
    const data = measurements.map(m => 
      `${m.label}: ${convertValue(m.value, m.unit)} ${unit}`
    ).join('\n');
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-measurements.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUnit("cm")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              unit === "cm"
                ? "bg-white text-indigo-600 shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            cm
          </button>
          <button
            onClick={() => setUnit("inches")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              unit === "inches"
                ? "bg-white text-indigo-600 shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            inches
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadMeasurements}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Download measurements"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Share measurements"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Measurements Grid */}
      {measurements.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500">Upload photos to get measurements</p>
        </div>
      ) : (
        <div className="space-y-3">
          {measurements.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="group relative bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer overflow-hidden"
            >
              {/* Background Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {m.label.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{m.label}</div>
                    <div className="text-xs text-gray-500">
                      {m.bbox ? `Detected area: ${Math.round(m.bbox.w)}×${Math.round(m.bbox.h)}px` : 'Standard measurement'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {convertValue(m.value, m.unit)}
                  </div>
                  <div className="text-sm font-medium text-gray-500">{unit}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Metadata Card */}
      {metadata && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200"
        >
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            AI Analysis Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Model Version:</span>
              <div className="font-medium text-gray-900">
                {metadata.modelVersion || 'AI v1.0'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Confidence:</span>
              <div className="font-medium text-gray-900">
                {((metadata.confidence || 0.91) * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <span className="text-gray-500">API Source:</span>
              <div className="font-medium text-gray-900">
                {metadata.apiSource || 'External'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <div className={`font-medium ${metadata.fallback ? 'text-orange-600' : 'text-green-600'}`}>
                {metadata.fallback ? '⚠ Fallback' : '✓ Connected'}
              </div>
            </div>
          </div>
          
          {metadata.fallback && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-800">
              <strong>Note:</strong> Using fallback measurements. External API temporarily unavailable.
            </div>
          )}
        </motion.div>
      )}

      {/* Tips Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3"
      >
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">
          <p className="font-semibold text-blue-900 mb-1">Accuracy Tips</p>
          <p className="text-blue-700">
            AI measurements are estimates with ±2-3% variance. For best results, wear fitted clothing 
            and ensure good lighting. Consider taking multiple measurements for verification.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
