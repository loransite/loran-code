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
        <div className="flex items-center gap-2 rounded-lg p-1" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setUnit("cm")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              unit === "cm"
                ? "shadow"
                : ""
            }`}
              style={{ background: unit === "cm" ? "var(--highlight)" : "transparent", color: unit === "cm" ? "#0E2A22" : "var(--muted)" }}
          >
            cm
          </button>
          <button
            onClick={() => setUnit("inches")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              unit === "inches"
                ? "shadow"
                : ""
            }`}
              style={{ background: unit === "inches" ? "var(--highlight)" : "transparent", color: unit === "inches" ? "#0E2A22" : "var(--muted)" }}
          >
            inches
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadMeasurements}
            className="p-2 rounded-lg transition"
            style={{ color: "var(--muted)", background: "transparent" }}
            title="Download measurements"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-lg transition"
            style={{ color: "var(--muted)", background: "transparent" }}
            title="Share measurements"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Measurements Grid */}
      {measurements.length === 0 ? (
        <div className="text-center py-12" style={{ color: "var(--muted)" }}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
            <svg className="w-10 h-10" style={{ color: "var(--highlight)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p>Upload photos to get measurements</p>
        </div>
      ) : (
        <div className="space-y-3">
          {measurements.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="group relative rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer overflow-hidden"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              {/* Background Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg" style={{ background: "var(--highlight)", color: "#0E2A22" }}>
                    {m.label.charAt(0)}
                  </div>
                  <div>
                      <div className="text-lg font-bold" style={{ color: "var(--text)" }}>{m.label}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {m.bbox ? `Detected area: ${Math.round(m.bbox.w)}×${Math.round(m.bbox.h)}px` : 'Standard measurement'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: "var(--highlight)" }}>
                    {convertValue(m.value, m.unit)}
                  </div>
                  <div className="text-sm font-medium" style={{ color: "var(--muted)" }}>{unit}</div>
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
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <span className="text-lg">🤖</span>
            AI Analysis Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span style={{ color: "var(--muted)" }}>Model Version:</span>
              <div className="font-medium" style={{ color: "var(--text)" }}>
                {metadata.modelVersion || 'AI v1.0'}
              </div>
            </div>
            <div>
              <span style={{ color: "var(--muted)" }}>Confidence:</span>
              <div className="font-medium" style={{ color: "var(--text)" }}>
                {((metadata.confidence || 0.91) * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <span style={{ color: "var(--muted)" }}>API Source:</span>
              <div className="font-medium" style={{ color: "var(--text)" }}>
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
          
          {/* Removed temporary fallback prompt per UX request */}
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
