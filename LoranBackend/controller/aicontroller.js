import { generateAIResponse } from "../services/aiService.js"; // For generateDesign

export const uploadPhoto = async (req, res) => {
  try {
    // file is at req.file.path or /uploads/filename
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    // Mocked measurement data
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

    // Placeholder: Call an AI service to generate a design
    const design = await generateAIResponse(prompt); // Replace with actual AI service call
    res.json({ message: "Design generated successfully", design });
  } catch (error) {
    console.error("Error generating design:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};