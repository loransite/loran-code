"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, User, Ruler, Sparkles, X, Camera, Image as ImageIcon } from "lucide-react";
import { processImage, ProcessResult } from "../../lib/ai";

type Props = {
  onResult: (r: ProcessResult) => void;
};

export default function EnhancedUploadForm({ onResult }: Props) {
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [sidePhoto, setSidePhoto] = useState<File | null>(null);
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<"cm" | "inches">("cm");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  const [showCameraOption, setShowCameraOption] = useState<"front" | "side" | null>(null);

  const handleFileSelect = (file: File, type: "front" | "side") => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    const preview = URL.createObjectURL(file);
    
    if (type === "front") {
      setFrontPhoto(file);
      setFrontPreview(preview);
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      setStep(2);
    } else {
      setSidePhoto(file);
      setSidePreview(preview);
      if (sidePreview) URL.revokeObjectURL(sidePreview);
      setStep(3);
    }
    
    setError(null);
    setShowCameraOption(null);
  };

  const handleCameraCapture = (type: "front" | "side") => {
    setShowCameraOption(type);
  };

  const openFileSelector = (type: "front" | "side") => {
    if (type === "front") {
      frontInputRef.current?.click();
    } else {
      sideInputRef.current?.click();
    }
    setShowCameraOption(null);
  };

  const removePhoto = (type: "front" | "side") => {
    if (type === "front") {
      setFrontPhoto(null);
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      setFrontPreview(null);
      setStep(1);
    } else {
      setSidePhoto(null);
      if (sidePreview) URL.revokeObjectURL(sidePreview);
      setSidePreview(null);
      if (step > 2) setStep(2);
    }
  };

  const handleGenerate = async () => {
    if (!frontPhoto) {
      setError("Please upload a front photo");
      return;
    }

    if (!height || parseFloat(height) <= 0) {
      setError("Please enter a valid height");
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Send both photos and height to the API
      const options = {
        height: parseFloat(height),
        unit,
        hasSidePhoto: !!sidePhoto
      };

      const result = await processImage(frontPhoto, options, (p) => setProgress(p), sidePhoto);
      onResult(result);
      setStep(4);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to process images. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const canGenerate = frontPhoto && height && parseFloat(height) > 0;

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: "Front Photo", icon: Camera },
          { num: 2, label: "Side Photo", icon: User },
          { num: 3, label: "Height", icon: Ruler },
          { num: 4, label: "Generate", icon: Sparkles }
        ].map(({ num, label, icon: Icon }, i) => (
          <div key={num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                animate={{
                  scale: step >= num ? 1 : 0.9,
                  backgroundColor: step >= num ? "rgb(79, 70, 229)" : "rgb(229, 231, 235)"
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step >= num ? "text-white shadow-lg shadow-indigo-500/30" : "text-gray-400"
                }`}
              >
                {step > num ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xl"
                  >
                    ✓
                  </motion.div>
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </motion.div>
              <span className={`text-xs font-medium ${step >= num ? "text-indigo-600" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < 3 && (
              <div className={`h-0.5 flex-1 mx-2 transition-colors ${
                step > num ? "bg-indigo-600" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Upload Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Front Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-2xl border-2 border-dashed transition-all ${
            frontPhoto ? "border-[#E8DCC0]" : "border-gray-500/40"
          }`}
          style={{ background: "var(--surface-2)" }}
        >
          <input
            ref={frontInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "front")}
          />
          
          {frontPreview ? (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img src={frontPreview} alt="Front" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => removePhoto("front")}
                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  <span className="font-semibold">Front Photo</span>
                </div>
              </div>
            </div>
          ) : showCameraOption === "front" ? (
            <div className="w-full aspect-[3/4] flex flex-col items-center justify-center p-8 gap-4">
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Choose Option</h3>
              <button
                onClick={() => {
                  frontInputRef.current?.click();
                }}
                className="w-full py-4 px-6 rounded-xl font-medium transition flex items-center justify-center gap-3 shadow-lg"
                style={{ background: "var(--highlight)", color: "#0E2A22" }}
              >
                <Camera className="w-5 h-5" />
                Take Photo with Camera
              </button>
              <button
                onClick={openFileSelector.bind(null, "front")}
                className="w-full py-4 px-6 border-2 rounded-xl font-medium transition flex items-center justify-center gap-3"
                style={{ background: "transparent", borderColor: "var(--highlight)", color: "var(--highlight)" }}
              >
                <ImageIcon className="w-5 h-5" />
                Upload from Gallery
              </button>
              <button
                onClick={() => setShowCameraOption(null)}
                className="text-sm transition"
                style={{ color: "var(--muted)" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleCameraCapture("front")}
              className="w-full aspect-[3/4] flex flex-col items-center justify-center p-8 hover:bg-indigo-100/50 transition"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Upload Front Photo</h3>
              <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
                Stand facing the camera<br />
                Arms slightly away from body
              </p>
              <div className="mt-4 px-4 py-2 rounded-lg text-sm font-medium shadow-sm" style={{ background: "var(--surface)", color: "var(--highlight)" }}>
                Choose Photo
              </div>
            </button>
          )}
        </motion.div>

        {/* Side Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative rounded-2xl border-2 border-dashed transition-all ${
            sidePhoto ? "border-[#E8DCC0]" : "border-gray-500/40"
          } ${!frontPhoto ? "opacity-50" : ""}`}
          style={{ background: "var(--surface-2)" }}
        >
          <input
            ref={sideInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "side")}
            disabled={!frontPhoto}
          />
          
          {sidePreview ? (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img src={sidePreview} alt="Side" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => removePhoto("side")}
                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Side Photo</span>
                </div>
              </div>
            </div>
          ) : showCameraOption === "side" ? (
            <div className="w-full aspect-[3/4] flex flex-col items-center justify-center p-8 gap-4">
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Choose Option</h3>
              <button
                onClick={() => {
                  sideInputRef.current?.click();
                }}
                className="w-full py-4 px-6 rounded-xl font-medium transition flex items-center justify-center gap-3 shadow-lg"
                style={{ background: "var(--highlight)", color: "#0E2A22" }}
              >
                <Camera className="w-5 h-5" />
                Take Photo with Camera
              </button>
              <button
                onClick={openFileSelector.bind(null, "side")}
                className="w-full py-4 px-6 border-2 rounded-xl font-medium transition flex items-center justify-center gap-3"
                style={{ background: "transparent", borderColor: "var(--highlight)", color: "var(--highlight)" }}
              >
                <ImageIcon className="w-5 h-5" />
                Upload from Gallery
              </button>
              <button
                onClick={() => setShowCameraOption(null)}
                className="text-sm transition"
                style={{ color: "var(--muted)" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleCameraCapture("side")}
              disabled={!frontPhoto}
              className="w-full aspect-[3/4] flex flex-col items-center justify-center p-8 hover:bg-purple-100/50 transition disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Upload Side Photo</h3>
              <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
                Turn 90° to your right<br />
                Keep same distance from camera
              </p>
              {!frontPhoto && (
                <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Upload front photo first</p>
              )}
              {frontPhoto && (
                <div className="mt-4 px-4 py-2 rounded-lg text-sm font-medium shadow-sm" style={{ background: "var(--surface)", color: "var(--highlight)" }}>
                  Choose Photo
                </div>
              )}
            </button>
          )}
        </motion.div>
      </div>

      {/* Height Input */}
      <AnimatePresence>
        {frontPhoto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl p-6"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Ruler className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Enter Your Height</h3>
                <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                  This helps calibrate accurate measurements
                </p>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Enter height"
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border-2 outline-none transition text-lg font-medium"
                      style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
                    />
                  </div>
                  <div className="flex rounded-xl border-2 overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    <button
                      onClick={() => setUnit("cm")}
                      className={`px-6 py-3 font-medium transition ${
                        unit === "cm"
                          ? "text-white"
                          : "hover:opacity-90"
                      }`}
                      style={{ background: unit === "cm" ? "var(--highlight)" : "transparent", color: unit === "cm" ? "#0E2A22" : "var(--muted)" }}
                    >
                      cm
                    </button>
                    <button
                      onClick={() => setUnit("inches")}
                      className={`px-6 py-3 font-medium transition ${
                        unit === "inches"
                          ? "text-white"
                          : "hover:opacity-90"
                      }`}
                      style={{ background: unit === "inches" ? "var(--highlight)" : "transparent", color: unit === "inches" ? "#0E2A22" : "var(--muted)" }}
                    >
                      inches
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.35)" }}
          >
            <div className="text-red-600 text-xl">⚠️</div>
            <p className="text-red-800 font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button */}
      <motion.button
        onClick={handleGenerate}
        disabled={!canGenerate || processing}
        whileHover={canGenerate && !processing ? { scale: 1.02 } : {}}
        whileTap={canGenerate && !processing ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
          canGenerate && !processing
            ? "text-white hover:shadow-2xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        style={canGenerate && !processing ? { background: "var(--highlight)", color: "#0E2A22", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" } : undefined}
      >
        {processing ? (
          <>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            Processing... {progress}%
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            Generate My Measurements
          </>
        )}
      </motion.button>

      {/* Processing Bar */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-full h-3 overflow-hidden" style={{ background: "var(--surface-2)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full"
                style={{ background: "var(--highlight)" }}
              />
            </div>
            <p className="text-center text-sm mt-2" style={{ color: "var(--muted)" }}>
              Our AI is analyzing your photos...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
