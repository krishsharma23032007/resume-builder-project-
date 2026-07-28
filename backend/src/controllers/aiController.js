const { generateJson, generateText } = require("../config/gemini");

async function improveBullet(req, res) {
  try {
    const { bullet, context, jobTitle } = req.body;

    if (!bullet || typeof bullet !== "string") {
      return res.status(400).json({ error: "bullet is required." });
    }

    const prompt = `You are a professional resume writer. Improve this resume bullet point to be more impactful, quantifiable, and action-oriented.
Original: ${bullet}
Context: ${context || "General professional experience"}
Job Title: ${jobTitle || "Not specified"}
Rules:
- Start with a strong action verb
- Include metrics/numbers if possible
- Be concise (1 line)
- Focus on impact, not just responsibilities
Return ONLY a JSON object: {"improved": "string", "explanation": "string"}`;

    const response = await generateJson(prompt);

    if (!response.improved || !response.explanation) {
      return res.status(502).json({ error: "Gemini returned an incomplete bullet improvement." });
    }

    return res.json({
      improved: response.improved,
      explanation: response.explanation
    });
  } catch (error) {
    console.error("Improve bullet error:", error);
    return res.status(500).json({ error: "Failed to improve resume bullet." });
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
    const { resumeData, jobDescription, tone = "formal" } = req.body;
    const allowedTones = ["formal", "enthusiastic", "concise"];

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: "resumeData and jobDescription are required." });
    }

    if (!allowedTones.includes(tone)) {
      return res.status(400).json({ error: "tone must be one of: formal, enthusiastic, concise." });
    }

    const prompt = `Write a cover letter for this candidate applying to this job. Tone: ${tone}. Match their experience to the job requirements. Keep it under 300 words. Professional format.

Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Return only the cover letter text.`;

    const coverLetter = await generateText(prompt);
    return res.json({ coverLetter, tone });
  } catch (error) {
    console.error("Cover letter error:", error);
    return res.status(500).json({ error: "Failed to generate cover letter." });
  }
}

module.exports = {
  improveBullet,
  generateSummary,
  generateCoverLetter
};
