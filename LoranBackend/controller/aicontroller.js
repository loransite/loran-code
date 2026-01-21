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

    console.log(`[AI Controller] Processing images for user ${req.user.id}. Height: ${options.height}, BMI: ${options.bmi}`);

    const result = await detectMeasurements(
      file.path, 
      options, 
      sidePhoto ? sidePhoto.path : null
    );

    res.json(result);
  } catch (err) {
    console.error("[AI Controller] Error processing images:", err.message);
    res.status(500).json({ message: "AI processing failed", error: err.message });
  }
};

    // Try calling the external Swagger measurement API
    try {
      console.log(`[AI] Calling external Swagger API for file: ${file.filename}`);
      console.log(`[AI] Side photo: ${sidePhoto ? sidePhoto.filename : 'not provided'}`);
      console.log(`[AI] Height: ${options.height || 'not provided'} ${options.unit || ''}`);
      console.log(`[AI] API URL: ${process.env.MEASURE_API_URL}`);
      
      const result = await detectMeasurements(file.path, options, sidePhoto ? sidePhoto.path : null);
      
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
              value: m.value / 2.54, // Convert to inches
              unit: 'inches'
            };
          }
          return m;
        });
      }
      
      console.log(`[AI] ✅ External Swagger API SUCCESS: ${result.measurements?.length || 0} measurements`);
      result.metadata = {
        ...result.metadata,
        apiSource: 'swagger',
        apiStatus: 'connected'
      };
      
      return res.json(result);
    } catch (apiError) {
      console.warn(`[AI] ❌ External Swagger API FAILED: ${apiError.message}`);
      console.warn(`[AI] Using fallback mock data`);
      
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
          error: apiError.message 
        }
      });
    }
  } catch (err) {
    console.error("[AI] processImage error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};