"use client";

import axios from "axios";

export type Measurement = {
  label: string;
  value: number;
  unit: string;
  bbox?: { x: number; y: number; w: number; h: number };
};

export type ProcessResult = {
  measurements: Measurement[];
  processedImageUrl?: string;
  metadata?: { confidence?: number; modelVersion?: string };
};

export async function processImage(
  file: File,
  options: Record<string, unknown> = {},
  onProgress?: (p: number) => void,
  sidePhoto?: File | null
): Promise<ProcessResult> {
  const fd = new FormData();
  fd.append("file", file);
  if (sidePhoto) {
    fd.append("sidePhoto", sidePhoto);
  }
  fd.append("options", JSON.stringify(options));

  // Use backend if available, otherwise mock
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    // Mock a delay and response
    return new Promise((resolve) => {
      let p = 0;
      const t = setInterval(() => {
        p = Math.min(100, p + Math.round(Math.random() * 20));
        onProgress?.(p);
        if (p >= 100) {
          clearInterval(t);
          resolve(
            {
              measurements: [
                { label: "Chest", value: 96.4, unit: "cm", bbox: { x: 80, y: 40, w: 160, h: 120 } },
                { label: "Waist", value: 78.6, unit: "cm", bbox: { x: 90, y: 180, w: 140, h: 80 } },
              ],
              metadata: { confidence: 0.92, modelVersion: "v0.0.0-mock" },
            } as ProcessResult
          );
        }
      }, 400);
    });
  }

  const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/process`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / (e.total || 1))),
    timeout: 120000,
  });
  return res.data as ProcessResult;
}
