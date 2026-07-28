const { scoreResume } = require("../utils/atsScorer");
const { matchJobDescription } = require("../utils/jdMatcher");
const { extractPdfText } = require("../utils/pdfParser");

async function analyzeResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required. Use multipart/form-data field name 'resume'." });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF uploads are supported." });
    }

    const text = await extractPdfText(req.file.buffer);

    if (!text) {
      return res.status(422).json({ error: "Could not extract readable text from the PDF." });
    }

    return res.json(scoreResume(text));
  } catch (error) {
    console.error("Analyze error:", error);
    return res.status(500).json({ error: "Failed to analyze resume PDF." });
  }
}

async function matchResumeToJob(req, res) {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: "resumeData and jobDescription are required." });
    }

    return res.json(matchJobDescription(resumeData, jobDescription));
  } catch (error) {
    console.error("JD match error:", error);
    return res.status(500).json({ error: "Failed to match resume with job description." });
  }
}

module.exports = {
  analyzeResume,
  matchResumeToJob
};
