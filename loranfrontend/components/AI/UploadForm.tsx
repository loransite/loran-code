"use client";

import { useState, useRef, useEffect } from "react";
import { processImage } from "../../lib/ai";
import { ProcessResult } from "../../lib/ai";

type Props = {
  onResult: (r: ProcessResult) => void;
  onPreview?: (url: string) => void;
};

export default function UploadForm({ onResult, onPreview }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      setProcessing(true);
      setError(null);
      try {
        const res = await processImage(file, {}, (p) => setProgress(p));
        onResult(res);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Processing failed. Try again.");
      } finally {
        setProcessing(false);
      }
    })();
  }, [file, onResult]);

  const handleFiles = (f?: FileList | null) => {
    if (!f || !f[0]) return;
    const picked = f[0];
    if (!picked.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }
    setFile(picked);
    if (inputRef.current) {
      const url = URL.createObjectURL(picked);
      onPreview?.(url);
      // revoke later when not needed
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-2">Upload Image</h3>
      <div
        className="border-2 border-dashed rounded p-6 text-center cursor-pointer hover:border-gray-400"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
        <p className="text-xs text-gray-400 mt-2">We will process the image and return measurements</p>
      </div>

      {processing && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2"
              style={{ width: `${progress}%`, transition: "width 200ms" }}
            />
          </div>
          <p className="text-sm mt-2">Processing... {progress}%</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {file && !processing && (
        <div className="mt-3 text-sm text-gray-700">Selected file: {file.name}</div>
      )}
    </div>
  );
}
