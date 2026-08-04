const { generateJson, generateText } = require("../config/gemini");

const BULLET_MIN_LENGTH = 5;
const BULLET_MAX_LENGTH = 1000;
const CONTEXT_MAX_LENGTH = 5000;
const JOB_TITLE_MAX_LENGTH = 200;

function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim();
}

function validateBulletLength(bullet) {
  if (!bullet || typeof bullet !== "string") {
    return "bullet is required.";
  }
  const trimmed = bullet.trim();
  if (trimmed.length < BULLET_MIN_LENGTH) {
    return `bullet must be at least ${BULLET_MIN_LENGTH} characters.`;
  }
  if (trimmed.length > BULLET_MAX_LENGTH) {
    return `bullet must be ${BULLET_MAX_LENGTH} characters or less.`;
  }
  return null;
}

function validateOptionalString(value, name, maxLength) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return `${name} must be a string.`;
  if (value.length > maxLength) return `${name} must be ${maxLength} characters or less.`;
  return null;
}

async function improveBullet(req, res) {
  try {
    const { bullet, context, jobTitle } = req.body;

    const bulletError = validateBulletLength(bullet);
    if (bulletError) {
      return res.status(400).json({ error: bulletError });
    }

    const contextError = validateOptionalString(context, "context", CONTEXT_MAX_LENGTH);
    if (contextError) {
      return res.status(400).json({ error: contextError });
    }

    const jobTitleError = validateOptionalString(jobTitle, "jobTitle", JOB_TITLE_MAX_LENGTH);
    if (jobTitleError) {
      return res.status(400).json({ error: jobTitleError });
    }

    const cleanBullet = sanitizeInput(bullet);
    const cleanContext = context ? sanitizeInput(context) : "General professional experience";
    const cleanJobTitle = jobTitle ? sanitizeInput(jobTitle) : "Not specified";

    const prompt = `You are a professional resume writer. Improve this resume bullet point to be more impactful, quantifiable, and action-oriented.
Original: ${cleanBullet}
Context: ${cleanContext}
Job Title: ${cleanJobTitle}
Rules:
- Start with a strong action verb
- Include metrics/numbers if possible
- Be concise (1 line)
- Focus on impact, not just responsibilities
- Maintain the original meaning and intent
Return ONLY a JSON object: {"improved": "string", "explanation": "string"}`;

    const response = await generateJson(prompt);

    if (!response || typeof response !== "object") {
      return res.status(502).json({ error: "Failed to parse AI response." });
    }

    if (!response.improved || typeof response.improved !== "string") {
      return res.status(502).json({ error: "AI response missing improved bullet." });
    }

    if (!response.explanation || typeof response.explanation !== "string") {
      return res.status(502).json({ error: "AI response missing explanation." });
    }

    return res.json({
      improved: response.improved,
      explanation: response.explanation
    });
  } catch (error) {
    console.error("Improve bullet error:", error);
    if (error.message && error.message.includes("invalid JSON")) {
      return res.status(502).json({ error: "AI returned an invalid response. Please try again." });
    }
    return res.status(500).json({ error: "Failed to improve resume bullet. Please try again later." });
  }
}

async function generateSummary(req, res) {
  try {
    const { resumeData } = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({ error: "resumeData is required." });
    }

    const prompt = `Write a professional resume summary (2-3 sentences) based on this profile. Highlight key strengths, years of experience, and career focus.

Profile:
${JSON.stringify(resumeData, null, 2)}

Return only the summary text.`;

    const summary = await generateText(prompt);
    return res.json({ summary });
  } catch (error) {
    console.error("Generate summary error:", error);
    return res.status(500).json({ error: "Failed to generate resume summary." });
  }
}

async function generateCoverLetter(req, res) {
  try {
    const { resumeData, jobDescription, tone = "formal", company, jobTitle } = req.body;
    const allowedTones = ["formal", "enthusiastic", "concise"];

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: "resumeData and jobDescription are required." });
    }

    if (!allowedTones.includes(tone)) {
      return res.status(400).json({ error: "tone must be one of: formal, enthusiastic, concise." });
    }

    const cleanCompany = company ? sanitizeInput(company) : "";
    const cleanJobTitle = jobTitle ? sanitizeInput(jobTitle) : "";
    const cleanJobDesc = sanitizeInput(jobDescription);

    const targetInfo = [
      cleanCompany ? `Company: ${cleanCompany}` : "",
      cleanJobTitle ? `Job Title: ${cleanJobTitle}` : ""
    ].filter(Boolean).join("\n");

    const prompt = `Write a professional cover letter for this candidate. Tone: ${tone}. Keep it under 300 words. Professional format with greeting, body paragraphs, and closing.

Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${cleanJobDesc}
${targetInfo ? `\n${targetInfo}` : ""}

Rules:
- Address the letter to the hiring manager
- Match the candidate's experience to the job requirements
- Highlight relevant skills and achievements
- Use the specified tone: ${tone}
- Keep it under 300 words
${cleanCompany ? `- Mention the company name: ${cleanCompany}` : ""}
${cleanJobTitle ? `- Reference the specific role: ${cleanJobTitle}` : ""}

Return only the cover letter text.`;

    const coverLetter = await generateText(prompt);
    return res.json({ coverLetter, tone });
  } catch (error) {
    console.error("Cover letter error:", error);
    return res.status(500).json({ error: "Failed to generate cover letter. Please try again later." });
  }
}

module.exports = {
  improveBullet,
  generateSummary,
  generateCoverLetter
};
