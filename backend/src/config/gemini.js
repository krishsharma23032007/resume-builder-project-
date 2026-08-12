const BASE_URL = process.env.MIMO_API_BASE_URL || "https://token-plan-sgp.xiaomimimo.com/v1";
const MODEL_NAME = process.env.MIMO_MODEL || "mimo-v2.5-pro";

async function callApi(messages, options = {}) {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    console.error("MIMO_API_KEY environment variable is not set");
    throw new Error("AI service is not configured. Please contact support.");
  }

  const body = {
    model: MODEL_NAME,
    messages,
    temperature: 0.4,
    max_tokens: 4096
  };

  if (options.json) {
    body.response_format = { type: "json_object" };
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`API error ${response.status}:`, error);
      throw new Error(`AI service error (${response.status}). Please try again.`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid API response structure:", data);
      throw new Error("AI service returned an invalid response.");
    }
    return data.choices[0].message.content.trim();
  } catch (fetchError) {
    if (fetchError.message.includes("AI service")) {
      throw fetchError;
    }
    console.error("API call failed:", fetchError);
    throw new Error("Failed to connect to AI service. Please try again later.");
  }
}

async function generateJson(prompt) {
  const text = await callApi([{ role: "user", content: prompt }], { json: true });
  return parseJsonResponse(text);
}

async function generateText(prompt) {
  return callApi([{ role: "user", content: prompt }]);
}

function parseJsonResponse(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      const trimmed = text.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          return JSON.parse(trimmed);
        } catch (_) {}
      }
      throw new Error("AI returned an invalid JSON response.");
    }
    try {
      return JSON.parse(match[0]);
    } catch (_) {
      const cleaned = match[0]
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");
      return JSON.parse(cleaned);
    }
  }
}

module.exports = {
  MODEL_NAME,
  generateJson,
  generateText
};
