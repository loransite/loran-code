import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const generateAIResponse = async (prompt) => {
  return {
    id: `design-${Date.now()}`,
    description: `Generated design based on prompt: ${prompt}`,
    createdAt: new Date(),
    details: { type: "clothing", style: prompt.includes("suit") ? "formal" : "casual", color: "blue" },
  };
};

export const detectMeasurements = async (filePath, options = {}, sidePhotoPath = null) => {
  const url = process.env.MEASURE_API_URL || "https://live-measurements-api-zsgak2zqxq-uc.a.run.app/upload_images";
  
  const apiKey = process.env.MEASURE_API_KEY || "";
  const authType = (process.env.MEASURE_API_AUTH_TYPE || "bearer").toLowerCase();
  const customAuthHeader = process.env.MEASURE_API_AUTH_HEADER || "";

  const form = new FormData();
  // Swagger API expects "front" field name
  form.append("front", fs.createReadStream(filePath));
  
  // Add side photo with correct field name "left_side"
  if (sidePhotoPath) {
    form.append("left_side", fs.createReadStream(sidePhotoPath));
  }
  
  // Add height in cm if provided
  if (options.height) {
    const heightInCm = options.unit === "inches" ? options.height * 2.54 : options.height;
    form.append("height_cm", heightInCm.toString());
  }

  const headers = { ...form.getHeaders() };
  if (apiKey) {
    if (authType === "header" && customAuthHeader) headers[customAuthHeader] = apiKey;
    else headers["Authorization"] = `Bearer ${apiKey}`;
  }

  console.log(`[AI Service] Sending to API: front photo + ${sidePhotoPath ? 'side photo' : 'no side photo'}`);
  console.log(`[AI Service] Height: ${options.height ? (options.unit === "inches" ? options.height * 2.54 : options.height) + ' cm' : 'not provided'}`);

  const resp = await axios.post(url, form, { headers, timeout: 120000 });
  const data = resp.data || {};
  
  console.log(`[AI Service] ✅ API Response Status: ${resp.status}`);
  console.log(`[AI Service] API Response Data:`, JSON.stringify(data, null, 2));
  
  // Parse the response - Swagger API might return measurements in different format
  let measurements = [];
  
  if (data.measurements && typeof data.measurements === 'object') {
    // If measurements is an object like {chest: 38, waist: 32, ...}
    measurements = Object.entries(data.measurements).map(([label, value]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value: typeof value === 'number' ? value : parseFloat(value) || 0,
      unit: "cm"
    }));
  } else if (Array.isArray(data.measurements)) {
    // If measurements is already an array
    measurements = data.measurements;
  } else if (data.results) {
    // Try results field
    measurements = Array.isArray(data.results) ? data.results : [];
  }
  
  return {
    measurements,
    processedImageUrl: data.processedImageUrl || data.imageUrl || data.image_url || null,
    metadata: data.metadata || { source: "external", confidence: data.confidence, raw: data },
  };
};
