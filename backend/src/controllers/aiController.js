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

    const { personal, experience, education, skills, projects, certifications } = resumeData;

    // Build structured profile for the prompt
    const parts = [];

    if (personal?.name) parts.push(`Name: ${personal.name}`);
    if (personal?.role) parts.push(`Target Role: ${personal.role}`);

    // Calculate years of experience from experience entries
    if (experience?.length > 0) {
      const titles = experience.map(e => e.title).filter(Boolean);
      const companies = experience.map(e => e.company).filter(Boolean);
      if (titles.length > 0) parts.push(`Experience: ${titles.join(", ")} at ${companies.join(", ")}`);

      // Estimate years from date ranges
      const years = estimateYears(experience);
      if (years > 0) parts.push(`~${years} years of experience`);
    }

    if (education?.length > 0) {
      const degrees = education.map(e => `${e.degree} ${e.field ? "in " + e.field : ""}`.trim()).filter(Boolean);
      if (degrees.length > 0) parts.push(`Education: ${degrees.join(", ")}`);
    }

    if (skills?.length > 0) {
      const allSkills = skills.flatMap(s => s.items || []).filter(Boolean);
      if (allSkills.length > 0) parts.push(`Key Skills: ${allSkills.slice(0, 10).join(", ")}`);
    }

    if (projects?.length > 0) {
      const projectNames = projects.map(p => p.name).filter(Boolean);
      if (projectNames.length > 0) parts.push(`Notable Projects: ${projectNames.slice(0, 3).join(", ")}`);
    }

    if (certifications?.length > 0) {
      const certNames = certifications.map(c => c.name).filter(Boolean);
      if (certNames.length > 0) parts.push(`Certifications: ${certNames.slice(0, 3).join(", ")}`);
    }

    // Handle weak/incomplete data
    if (parts.length === 0) {
      return res.json({
        summary: "Motivated professional seeking new opportunities to contribute skills and grow in a dynamic environment."
      });
    }

    if (parts.length <= 2) {
      // Minimal data — still generate but note it
      parts.push("(Note: Limited profile data provided)");
    }

    const profile = parts.join("\n");

    const prompt = `Write a professional resume summary in exactly 2-3 sentences. Be concise and impactful. Highlight key strengths, experience level, and career focus.

Profile:
${profile}

Rules:
- Return ONLY the summary text, no quotes, no labels
- Exactly 2-3 sentences
- Professional tone
- Focus on value the candidate brings`;

    const summary = await generateText(prompt);
    return res.json({ summary: summary.trim() });
  } catch (error) {
    console.error("Generate summary error:", error);
    return res.status(500).json({ error: "Failed to generate resume summary." });
  }
}

function estimateYears(experience) {
  let earliest = null;
  let latest = null;

  for (const exp of experience) {
    const start = parseDate(exp.startDate);
    const end = exp.endDate ? parseDate(exp.endDate) : new Date();

    if (start && (!earliest || start < earliest)) earliest = start;
    if (end && (!latest || end > latest)) latest = end;
  }

  if (!earliest || !latest) return 0;
  return Math.max(1, Math.round((latest - earliest) / (365.25 * 24 * 60 * 60 * 1000)));
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
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

async function fixGrammar(req, res) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text is required." });
    }

    const trimmed = text.trim();
    if (trimmed.length < 5) {
      return res.status(400).json({ error: "text must be at least 5 characters." });
    }

    if (trimmed.length > 5000) {
      return res.status(400).json({ error: "text must be 5000 characters or less." });
    }

    const cleanText = sanitizeInput(text);

    const prompt = `You are a professional proofreader. Fix all grammar, spelling, and punctuation errors in the following text. Improve clarity and flow while preserving the original meaning and professional tone.

Original text:
${cleanText}

Rules:
- Fix grammar, spelling, and punctuation errors
- Improve sentence structure and clarity
- Maintain the original meaning and intent
- Keep the same tone and style
- Do not add new content or change the message
- Return ONLY a JSON object: {"corrected": "string", "changes": "string"}`;

    const response = await generateJson(prompt);

    if (!response || typeof response !== "object") {
      return res.status(502).json({ error: "Failed to parse AI response." });
    }

    if (!response.corrected || typeof response.corrected !== "string") {
      return res.status(502).json({ error: "AI response missing corrected text." });
    }

    if (!response.changes || typeof response.changes !== "string") {
      return res.status(502).json({ error: "AI response missing changes explanation." });
    }

    return res.json({
      corrected: response.corrected,
      changes: response.changes
    });
  } catch (error) {
    console.error("Fix grammar error:", error);
    if (error.message && error.message.includes("invalid JSON")) {
      return res.status(502).json({ error: "AI returned an invalid response. Please try again." });
    }
    return res.status(500).json({ error: "Failed to fix grammar. Please try again later." });
  }
}

module.exports = {
  improveBullet,
  fixGrammar,
  generateSummary,
  generateCoverLetter
};
