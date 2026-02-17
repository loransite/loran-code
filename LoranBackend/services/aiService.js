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
  let url = process.env.MEASURE_API_URL || "https://live-measurements-api-zsgak2zqxq-uc.a.run.app/upload_images";
  
  const apiKey = process.env.MEASURE_API_KEY || "";
  const authType = (process.env.MEASURE_API_AUTH_TYPE || "bearer").toLowerCase();
  const customAuthHeader = process.env.MEASURE_API_AUTH_HEADER || "";
  const queryParam = process.env.MEASURE_API_QUERY_PARAM || "api_key";

  const fileField = process.env.MEASURE_API_FILE_FIELD || "front"; // e.g. "image", "front"
  const sideField = process.env.MEASURE_API_SIDE_FILE_FIELD || "left_side"; // e.g. "side", "left_side"
  const heightField = process.env.MEASURE_API_HEIGHT_FIELD || "height_cm"; // e.g. "height", "height_cm"

  const form = new FormData();
  // Use configurable field name for front image
  form.append(fileField, fs.createReadStream(filePath));
  
  // Add side photo with correct field name "left_side"
  if (sidePhotoPath) {
    form.append(sideField, fs.createReadStream(sidePhotoPath));
  }
  
  // Add height in cm if provided
  if (options.height) {
    const heightInCm = options.unit === "inches" ? options.height * 2.54 : options.height;
    form.append(heightField, heightInCm.toString());
  }

  const headers = { ...form.getHeaders() };
  if (apiKey) {
    if (authType === "none") {
      // do nothing
    } else if (authType === "header" && customAuthHeader) {
      headers[customAuthHeader] = apiKey;
    } else if (authType === "bearer") {
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else if (authType === "query") {
      // attach api key as query parameter
      try {
        const u = new URL(url);
        u.searchParams.set(queryParam, apiKey);
        url = u.toString();
      } catch {
        // fallback to string concat
        url += (url.includes("?") ? "&" : "?") + `${queryParam}=${encodeURIComponent(apiKey)}`;
      }
    }
  }

  console.log(`[AI Service] Endpoint: ${url}`);
  console.log(`[AI Service] Fields: front=${fileField} side=${sidePhotoPath ? sideField : 'none'} heightField=${heightField}`);
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
