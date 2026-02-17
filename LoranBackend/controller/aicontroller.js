import { generateAIResponse, detectMeasurements } from "../services/aiService.js";

export const uploadPhoto = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const measurements = {
      chest: 36,
      waist: 28,
      hips: 38,
      shoulder: 16,
      inseam: 30,
      imageUrl: imagePath,
    };

    res.status(200).json({ message: "Measurements generated (mock)", measurements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateDesign = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const design = await generateAIResponse(prompt);
    res.json({ message: "Design generated successfully", design });
  } catch (error) {
    console.error("Error generating design:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const processImage = async (req, res) => {
  try {
    const requestId = `ai-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const origin = req.headers.origin || req.get('origin');
    console.log(`[AI][${requestId}] Incoming /api/ai/process | Origin: ${origin} | User: ${req.user?.id}`);
    console.log(`[AI][${requestId}] Headers: content-type=${req.headers['content-type']} content-length=${req.headers['content-length']}`);

    // Files are provided by uploadAiFields middleware
    const file = req.files && req.files.file ? req.files.file[0] : null;
    const sidePhoto = req.files && req.files.sidePhoto ? req.files.sidePhoto[0] : null;
    
    if (!file) return res.status(400).json({ message: "Front image file is required" });

    let options = {};
    if (req.body.options) {
      try {
        options = typeof req.body.options === 'string' ? JSON.parse(req.body.options) : req.body.options;
      } catch (e) {
        console.warn("[AI Controller] Failed to parse options", e);
      }
    }

    // Merge in height/bmi if they are directly in body
    if (req.body.height) options.height = parseFloat(req.body.height);
    if (req.body.bmi) options.bmi = parseFloat(req.body.bmi);

    console.log(`[AI][${requestId}] Processing images | height=${options.height} bmi=${options.bmi}`);
    console.log(`[AI][${requestId}] Front file: name=${file.originalname} type=${file.mimetype} size=${file.size} path=${file.path}`);
    if (sidePhoto) {
      console.log(`[AI][${requestId}] Side file: name=${sidePhoto.originalname} type=${sidePhoto.mimetype} size=${sidePhoto.size} path=${sidePhoto.path}`);
    } else {
      console.log(`[AI][${requestId}] Side file: none`);
    }

    // Try calling the external Swagger measurement API
    try {
      const result = await detectMeasurements(
        file.path, 
        options, 
        sidePhoto ? sidePhoto.path : null
      );
      
      // If external API doesn't return processedImageUrl, use uploaded file
      if (!result.processedImageUrl) {
        result.processedImageUrl = `/uploads/${file.filename}`;
      }
      
      // Convert all measurements to inches if they're in cm
      if (result.measurements) {
        result.measurements = result.measurements.map(m => {
          if (m.unit === 'cm') {
            return {
              ...m,
              value: parseFloat((m.value / 2.54).toFixed(2)), // Convert to inches
              unit: 'inches'
            };
          }
          return m;
        });
      }
      
      console.log(`[AI][${requestId}] ✅ External API SUCCESS: ${result.measurements?.length || 0} measurements`);
      result.metadata = {
        ...result.metadata,
        apiSource: 'swagger',
        apiStatus: 'connected'
      };
      
      return res.json(result);
    } catch (apiError) {
      const isAxios = !!apiError.isAxiosError;
      const status = apiError?.response?.status;
      const code = apiError?.code;
      const apiUrl = apiError?.config?.url;
      let respData = apiError?.response?.data;
      try { respData = typeof respData === 'string' ? respData : JSON.stringify(respData).slice(0, 2000); } catch {}

      console.warn(`[AI][${requestId}] ❌ External API FAILED: message=${apiError.message} status=${status} code=${code} url=${apiUrl}`);
      if (isAxios) {
        console.warn(`[AI][${requestId}] Axios error details:`, respData);
      }
      console.warn(`[AI][${requestId}] Using fallback mock data`);
      
      // Fallback to mock measurements IN INCHES
      const imageUrl = `/uploads/${file.filename}`;
      const measurements = [
        { label: "Chest", value: 38.0, unit: "inches", bbox: { x: 80, y: 40, w: 160, h: 120 } },
        { label: "Waist", value: 31.0, unit: "inches", bbox: { x: 90, y: 180, w: 140, h: 80 } },
        { label: "Hips", value: 40.3, unit: "inches", bbox: { x: 85, y: 270, w: 150, h: 100 } },
        { label: "Shoulder", value: 16.6, unit: "inches", bbox: { x: 60, y: 20, w: 200, h: 60 } },
      ];

      return res.json({
        measurements,
        processedImageUrl: imageUrl,
        metadata: { 
          confidence: 0.91, 
          modelVersion: "dev-mock", 
          fallback: true,
          apiSource: 'mock',
          apiStatus: 'fallback',
          error: apiError.message,
          errorStatus: status,
          errorCode: code,
          apiUrl
        }
      });
    }
  } catch (err) {
    console.error("[AI] processImage error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};