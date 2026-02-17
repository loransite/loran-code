"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { processImageWithToken } from "../../lib/ai";
import { useAuth } from "../../lib/AuthContext";
import { Upload, Camera, Ruler, Activity, CheckCircle, AlertCircle, RefreshCcw, Sparkles, Info } from "lucide-react";

type Props = {
  onResult: (r: any) => void;
  onPreview?: (url: string) => void;
};

const Step = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-yellow-300">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-xs text-white/60">{description}</p>
    </div>
  </div>
);


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
      // @ts-ignore
      if (user.height) setHeight(user.height.toString());
      // @ts-ignore
      if (user.bmi) setBmi(user.bmi.toString());
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(`Please upload a valid image file for the ${type} view.`);
      return;
    }
    
    const url = URL.createObjectURL(file);
    if (type === 'front') {
      setFrontFile(file);
      setFrontPreview(url);
      onPreview?.(url); // Show front preview immediately
    } else {
      setSideFile(file);
      setSidePreview(url);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontFile || !sideFile) {
      setError("Both front and side photos are required for accurate results.");
      return;
    }
    if (!token) {
      setError("You must be logged in to use the AI Studio.");
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(10); // Initial progress

    const formData = new FormData();
    formData.append("file", frontFile);
    formData.append("sidePhoto", sideFile);
    if (height) formData.append("height", height);
    if (bmi) formData.append("bmi", bmi);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return p + 5;
      });
    }, 200);

    try {
      const result = await processImageWithToken(frontFile, token, {}, undefined, sideFile);
      clearInterval(progressInterval);
      setProgress(100);
      onResult(result);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setError(err.message || "AI analysis failed. Please check your photos and try again.");
      setProgress(0);
    } finally {
      setTimeout(() => setProcessing(false), 1000);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 border border-purple-500/50 rounded-2xl p-8 text-center shadow-2xl shadow-purple-500/20">
        <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 mb-4">
          <AlertCircle className="text-white" size={32} />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Premium Access Required</h3>
        <p className="text-white/70 mb-6">The AI Measurement Studio is an exclusive feature for our registered members.</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/login'}
          className="bg-yellow-400 text-indigo-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
        >
          Login to Unlock
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900/50 rounded-3xl shadow-2xl border border-white/10 p-1 overflow-hidden backdrop-blur-2xl">
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-40"
        animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
        }}
        style={{
            background: "linear-gradient(120deg, rgba(124, 58, 237, 0.3) 0%, rgba(99, 102, 241, 0) 30%, rgba(168, 85, 247, 0) 70%, rgba(236, 72, 153, 0.3) 100%)",
            backgroundSize: "400% 400%",
        }}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-white leading-tight">AI Measurement Studio</h3>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider">Get Your Perfect Fit</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl text-white shadow-lg shadow-purple-500/20">
            <Sparkles size={24} />
          </div>
        </div>

        {/* Tutorial Section */}
        <div className="bg-black/20 border border-white/10 rounded-2xl p-4 mb-6 space-y-3">
          <Step icon={<Camera size={16}/>} title="Upload Two Photos" description="A full-body front view and a side view." />
          <Step icon={<Ruler size={16}/>} title="Enter Your Metrics" description="Provide your height and BMI for accuracy." />
          <Step icon={<Activity size={16}/>} title="Generate Measurements" description="Our AI will create a precise 3D body model." />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Front Photo */}
            <div 
              onClick={() => frontInputRef.current?.click()}
              className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group ${
                frontPreview ? 'border-purple-500 bg-purple-900/20' : 'border-white/20 hover:border-purple-400 bg-black/20'
              }`}
            >
              {frontPreview ? (
                <img src={frontPreview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Front" />
              ) : (
                <div className="text-center text-white/40">
                  <Upload size={24} className="mx-auto mb-2" />
                  <span className="text-xs font-bold">Front View</span>
                </div>
              )}
              <input ref={frontInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'front')} />
            </div>

            {/* Side View */}
            <div 
              onClick={() => sideInputRef.current?.click()}
              className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group ${
                sidePreview ? 'border-pink-500 bg-pink-900/20' : 'border-white/20 hover:border-pink-400 bg-black/20'
              }`}
            >
              {sidePreview ? (
                <img src={sidePreview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Side" />
              ) : (
                <div className="text-center text-white/40">
                  <Upload size={24} className="mx-auto mb-2" />
                  <span className="text-xs font-bold">Side View</span>
                </div>
              )}
              <input ref={sideInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'side')} />
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase mb-2 ml-1">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input 
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition font-bold text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase mb-2 ml-1">BMI</label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input 
                  type="number"
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(e.target.value)}
                  placeholder="e.g. 22.5"
                  className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition font-bold text-white"
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-500/20 text-red-300 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-500/50"
              >
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={processing || !frontFile || !sideFile}
            whileHover={{ scale: processing || !frontFile || !sideFile ? 1 : 1.02 }}
            whileTap={{ scale: processing || !frontFile || !sideFile ? 1 : 0.98 }}
            className={`w-full py-4 rounded-2xl font-black text-lg transform transition-all flex items-center justify-center gap-3 relative overflow-hidden ${
              !frontFile || !sideFile
                ? 'bg-gray-500/20 text-white/40 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={processing ? "processing" : "ready"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <RefreshCcw size={20} />
                    </motion.div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Generate My Measurements
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {processing && (
            <div className="mt-4">
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
