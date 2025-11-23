export const generateAIResponse = async (prompt) => {
  try {
    // Mock implementation: Replace with actual AI service call (e.g., OpenAI API)
    const mockDesign = {
      id: `design-${Date.now()}`,
      description: `Generated design based on prompt: ${prompt}`,
      createdAt: new Date(),
      details: {
        type: "clothing",
        style: prompt.includes("suit") ? "formal" : "casual",
        color: "blue", // Example
      },
    };
    return mockDesign;
  } catch (error) {
    console.error("Error in AI service:", error.message, error.stack);
    throw new Error("Failed to generate AI response");
  }
};