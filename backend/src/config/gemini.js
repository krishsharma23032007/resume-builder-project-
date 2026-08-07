const BASE_URL = process.env.MIMO_API_BASE_URL || "https://token-plan-sgp.xiaomimimo.com/v1";
const MODEL_NAME = process.env.MIMO_MODEL || "mimo-v2.5-pro";

async function callApi(messages, options = {}) {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    throw new Error("MIMO_API_KEY is missing.");
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
    throw new Error(`API error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
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
