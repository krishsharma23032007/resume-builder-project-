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
