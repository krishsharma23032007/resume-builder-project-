const { GoogleGenerativeAI } = require("@google/generative-ai");

const MODEL_NAME = "gemini-2.5-flash";

function getGeminiModel(options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const generationConfig = {
    temperature: 0.4
  };

  if (options.json) {
    generationConfig.responseMimeType = "application/json";
  }

  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig
  });
}

async function generateJson(prompt) {
  const model = getGeminiModel({ json: true });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonResponse(text);
}

async function generateText(prompt) {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

function parseJsonResponse(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Gemini returned an invalid JSON response.");
    }
    return JSON.parse(match[0]);
  }
}

module.exports = {
  MODEL_NAME,
  generateJson,
  generateText
};
