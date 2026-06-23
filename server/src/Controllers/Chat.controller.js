import { GoogleGenAI } from "@google/genai";
import { AsyncHandler } from "../Utils/AsyncHandler.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatBot = AsyncHandler(async (req, res) => {
  const { message, language } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  try {
    const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: `
You are Lencho, a friendly agriculture assistant for Indian farmers.

Rules:
- Use very simple language
- Keep answers short and clear
- Use bullet points
- Add emojis where helpful
- Avoid long paragraphs
- Format output cleanly

Respond in ${language || "English"}.

User question: ${message}
`,
});


    res.json({
      success: true,
      data: response.text,
    });
  } catch (error) {
    console.error("AI ERROR:", error.message);

    res.status(500).json({
      success: false,
      data: {},
      message: "AI service temporarily unavailable. Please try again.",
    });
  }
});
