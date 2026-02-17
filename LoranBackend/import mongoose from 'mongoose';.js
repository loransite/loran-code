import mongoose from 'mongoose';
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

const uri = 'mongodb://tayotruce_db_user:Truce123@cluster0-shard-00-00.1eyabey.mongodb.net:27017,cluster0-shard-00-01.1eyabey.mongodb.net:27017,cluster0-shard-00-02.1eyabey.mongodb.net:27017/loran?replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
(async () => {
  try { await mongoose.connect(uri); console.log('Connected OK'); }
  catch (e) { console.error('Connect failed:', e.message); process.exit(1); }
})();

export const metadata: Metadata = {
  title: "Loran – Bespoke Fashion",
  description: "Fashion marketplace for AI try-on and designer showcase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}

export const generateAIResponse = async (prompt) => {
  try {
    const mockDesign = {
      id: `design-${Date.now()}`,
      description: `Generated design based on prompt: ${prompt}`,
      createdAt: new Date(),
      details: {
        type: "clothing",
        style: prompt.includes("suit") ? "formal" : "casual",
        color: "blue",
      },
    };
    return mockDesign;
  } catch (error) {
    console.error("Error in AI service:", error.message, error.stack);
    throw new Error("Failed to generate AI response");
  }
};

export const detectMeasurements = async (filePath, options = {}) => {
  try {
    const url = process.env.MEASURE_API_URL;
    if (!url) throw new Error("MEASURE_API_URL not configured");

    const fieldName = process.env.MEASURE_API_FILE_FIELD || "file";
    const apiKey = process.env.MEASURE_API_KEY || "";
    const authType = (process.env.MEASURE_API_AUTH_TYPE || "bearer").toLowerCase();
    const customAuthHeader = process.env.MEASURE_API_AUTH_HEADER || "";

    const form = new FormData();
    form.append(fieldName, fs.createReadStream(filePath));
    form.append("options", JSON.stringify(options));

    const headers = { ...form.getHeaders() };
    if (apiKey) {
      if (authType === "header" && customAuthHeader) {
        headers[customAuthHeader] = apiKey;
      } else {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
    }

    const resp = await axios.post(url, form, {
      headers,
      timeout: 120000,
    });

    const data = resp.data || {};
    return {
      measurements: data.measurements || data.results || [],
      processedImageUrl: data.processedImageUrl || data.imageUrl || null,
      metadata: data.metadata || { source: "external", raw: data },
    };
  } catch (error) {
    console.error("detectMeasurements error:", error.message);
    throw error;
  }
};