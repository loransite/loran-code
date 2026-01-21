"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { processImageWithToken } from "../../lib/ai";
import { ProcessResult } from "../../lib/ai";
import { useAuth } from "../../lib/AuthContext";
import { Upload, Camera, Ruler, Activity, CheckCircle, AlertCircle, RefreshCcw } from "lucide-react";

type Props = {
  onResult: (r: ProcessResult) => void;
  onPreview?: (url: string) => void;
};

export default function UploadForm({ onResult, onPreview }: Props) {
  const { user, token, isLoggedIn } = useAuth();
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [sideFile, setSideFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  
  const [height, setHeight] = useState<string>("");
  const [bmi, setBmi] = useState<string>("");
  
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  // Sync with user profile on load
  useEffect(() => {
    if (user) {
      if (user.height) setHeight(user.height.toString());
      // @ts-ignore - BMI might be in user object
      if (user.bmi) setBmi(user.bmi.toString());
    }
  }, [user]);

  const handleFrontFile = (f?: FileList | null) => {
    if (!f || !f[0]) return;
    const picked = f[0];
    if (!picked.type.startsWith("image/")) {
      setError("Please upload an image for the front view");
      return;
    }
    setFrontFile(picked);
    const url = URL.createObjectURL(picked);
    setFrontPreview(url);
    if (!sideFile) onPreview?.(url);
  };

  const handleSideFile = (f?: FileList | null) => {
    if (!f || !f[0]) return;
    const picked = f[0];
    if (!picked.type.startsWith("image/")) {
      setError("Please upload an image for the side view");
      return;
    }
    setSideFile(picked);
    const url = URL.createObjectURL(picked);
    setSidePreview(url);
  };

  const handleSubmit = async () => {
    if (!frontFile) {
      setError("At least a front photo is required");
      return;
    }
    if (!token) {
      setError("Please login to use AI Try-on");
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const options = {
        height: height ? parseFloat(height) : undefined,
        bmi: bmi ? parseFloat(bmi) : undefined
      };
      
      const res = await processImageWithToken(
        frontFile, 
        token, 
        options, 
        (p) => setProgress(p),
        sideFile
      );
      
      onResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "AI Analysis failed. Please try again with clearer photos.");
    } finally {
      setProcessing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
        <AlertCircle className="mx-auto text-blue-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-blue-900 mb-2">Member Access Only</h3>
        <p className="text-blue-700 mb-6">The AI Measurement & Try-On studio is exclusive to registered clients.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Login to Access
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 overflow-hidden">
      {/* Animated Gradient Background Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-900 leading-tight">AI Measurement Studio</h3>
          <p className="text-gray-500 text-sm">Upload photos for precise body measurement</p>
        </div>
        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
          <Camera size={24} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Front Photo */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400 pl-1">Front View</label>
          <div 
            onClick={() => frontInputRef.current?.click()}
            className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
              frontPreview ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 bg-gray-50'
            }`}
          >
            {frontPreview ? (
              <>
                <img src={frontPreview} className="w-full h-full object-cover" alt="Front" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <RefreshCcw className="text-white" size={24} />
                </div>
              </>
            ) : (
              <>
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-[10px] font-bold text-gray-500">Upload Front</span>
              </>
            )}
            <input 
              ref={frontInputRef}
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleFrontFile(e.target.files)}
            />
          </div>
        </div>

        {/* Side View */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400 pl-1">Side View</label>
          <div 
            onClick={() => sideInputRef.current?.click()}
            className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
              sidePreview ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 bg-gray-50'
            }`}
          >
            {sidePreview ? (
              <>
                <img src={sidePreview} className="w-full h-full object-cover" alt="Side" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <RefreshCcw className="text-white" size={24} />
                </div>
              </>
            ) : (
              <>
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-[10px] font-bold text-gray-500">Upload Side</span>
              </>
            )}
            <input 
              ref={sideInputRef}
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleSideFile(e.target.files)}
            />
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Height (cm)</label>
          <div className="relative">
            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 175"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-bold"
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">BMI Index</label>
          <div className="relative">
            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="number"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              placeholder="e.g. 22.5"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-bold"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleSubmit}
        disabled={processing || !frontFile}
        className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transform active:scale-95 transition-all flex items-center justify-center gap-3 ${
          processing || !frontFile 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {processing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCcw size={20} />
            </motion.div>
            Analyzing Body...
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            Start AI Analysis
          </>
        )}
      </button>

      {processing && (
        <div className="mt-6">
          <div className="flex justify-between text-[10px] font-black text-indigo-600 uppercase mb-2">
            <span>Server Communication</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-indigo-50 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-indigo-600 rounded-full"
            />
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2 font-bold italic">
            "We use precise AI algorithms to map your body structure..."
          </p>
        </div>
      )}
    </div>
  );
}
