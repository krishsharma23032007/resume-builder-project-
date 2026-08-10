const { scoreResume } = require("../utils/atsScorer");
const { matchJobDescription } = require("../utils/jdMatcher");
const { extractPdfText } = require("../utils/pdfParser");
const { generateJson } = require("../config/gemini");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPE = "application/pdf";

/**
 * Analyzes a resume PDF and returns ATS scoring.
 */
async function analyzeResume(req, res) {
  try {
    // Validate file exists
    if (!req.file) {
      return res.status(400).json({
        error: "PDF file is required.",
        details: "Upload a PDF file using multipart/form-data with field name 'resume'."
      });
    }

    // Validate MIME type
    if (req.file.mimetype !== ALLOWED_MIME_TYPE) {
      return res.status(400).json({
        error: "Only PDF files are accepted.",
        details: `Received file type: ${req.file.mimetype}. Please upload a .pdf file.`
      });
    }

    // Validate file size
    if (req.file.size > MAX_FILE_SIZE) {
      const sizeMB = (req.file.size / (1024 * 1024)).toFixed(1);
      return res.status(413).json({
        error: "File size exceeds the 5MB limit.",
        details: `Uploaded file is ${sizeMB}MB. Please compress or reduce the file size.`
      });
    }

    // Validate file extension
    const originalName = req.file.originalname || "";
    if (!originalName.toLowerCase().endsWith(".pdf")) {
      return res.status(400).json({
        error: "File must have a .pdf extension.",
        details: `Received filename: ${originalName}`
      });
    }

    // Extract text from PDF
    let pdfResult;
    try {
      pdfResult = await extractPdfText(req.file.buffer);
    } catch (pdfError) {
      return res.status(422).json({
        error: "Could not process the PDF file.",
        details: pdfError.message || "The file may be corrupted, password-protected, or contain only images."
      });
    }

    const { text, pageCount, wordCount } = pdfResult;

    // Validate extracted text
    if (!text || text.trim().length < 50) {
      return res.status(422).json({
        error: "Could not extract enough readable text from the PDF.",
        details: "The resume appears to be empty or contains only images/scanned content. Please upload a PDF with selectable text.",
        wordCount: wordCount || 0,
        pageCount: pageCount || 0
      });
    }

    // Score the resume
    const analysis = scoreResume(text);

    // Include metadata in response
    return res.json({
      ...analysis,
      wordCount,
      pageCount,
      fileSize: req.file.size,
      fileName: originalName
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return res.status(500).json({
      error: "Failed to analyze resume.",
      details: "An unexpected error occurred. Please try again."
    });
  }
}

/**
 * Matches a resume to a job description.
 */
async function matchResumeToJob(req, res) {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({
        error: "resumeData is required and must be an object."
      });
    }

    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({
        error: "jobDescription is required and must be a string."
      });
    }

    if (jobDescription.length > 5000) {
      return res.status(400).json({
        error: "Job description is too long.",
        details: "Maximum 5000 characters allowed."
      });
    }

    const result = matchJobDescription(resumeData, jobDescription);

    return res.json({
      ...result,
      resumeWordCount: countResumeWords(resumeData)
    });
  } catch (error) {
    console.error("JD match error:", error);
    return res.status(500).json({
      error: "Failed to match resume with job description.",
      details: "An unexpected error occurred. Please try again."
    });
  }
}

/**
 * Counts total words in resume data.
 */
function countResumeWords(resumeData) {
  let text = "";

  if (resumeData.personalInfo) {
    const p = resumeData.personalInfo;
    text += [p.name, p.role, p.summary, p.email, p.phone, p.location].filter(Boolean).join(" ");
  }

  const arrayFields = ["experience", "education", "projects", "skills", "certifications", "achievements"];
  for (const field of arrayFields) {
    if (Array.isArray(resumeData[field])) {
      for (const item of resumeData[field]) {
        if (typeof item === "object") {
          text += " " + Object.values(item).filter(v => typeof v === "string").join(" ");
          if (Array.isArray(item.bullets)) {
            text += " " + item.bullets.filter(Boolean).join(" ");
          }
          if (Array.isArray(item.items)) {
            text += " " + item.items.filter(Boolean).join(" ");
          }
        }
      }
    }
  }

  const words = text.match(/\b[\w'-]+\b/g) || [];
  return words.length;
}

async function parseResumePdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    if (req.file.mimetype !== ALLOWED_MIME_TYPE) {
      return res.status(400).json({ error: "Only PDF files are accepted." });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({ error: "File size exceeds the 5MB limit." });
    }

    let pdfResult;
    try {
      pdfResult = await extractPdfText(req.file.buffer);
    } catch (pdfError) {
      return res.status(422).json({ error: "Could not process the PDF.", details: pdfError.message });
    }

    const { text } = pdfResult;

    if (!text || text.trim().length < 50) {
      return res.status(422).json({ error: "Could not extract enough text from the PDF." });
    }

    const prompt = `You are an expert resume parser. Extract structured data from this resume text and return it as a JSON object.

Resume text:
${text}

Return ONLY a JSON object with this exact structure:
{
  "personal": {
    "name": "string",
    "role": "string",
    "location": "string",
    "email": "string",
    "phone": "string",
    "summary": "string"
  },
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "title": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": "string",
      "bullets": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": "string",
      "link": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "bullets": ["string"]
    }
  ],
  "skills": [
    {
      "category": "string",
      "items": ["string"]
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM",
      "link": "string"
    }
  ],
  "achievements": [
    {
      "title": "string",
      "description": "string",
      "date": "YYYY-MM"
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "beginner|elementary|intermediate|advanced|native"
    }
  ],
  "interests": [
    {
      "name": "string"
    }
  ]
}

Rules:
- Extract all information you can find
- Use empty strings for missing fields
- Use empty arrays for missing sections
- Dates should be in YYYY-MM format when possible
- For skills, group by category (e.g., "Programming Languages", "Tools", etc.)
- For proficiency, infer from context or default to "intermediate"
- Do not add information not present in the resume
- Return ONLY the JSON object, no other text`;

    const response = await generateJson(prompt);

    if (!response || typeof response !== "object") {
      return res.status(502).json({ error: "Failed to parse AI response." });
    }

    const parsed = {
      personal: {
        name: response.personal?.name || "",
        role: response.personal?.role || "",
        location: response.personal?.location || "",
        email: response.personal?.email || "",
        phone: response.personal?.phone || "",
        summary: response.personal?.summary || ""
      },
      education: Array.isArray(response.education) ? response.education : [],
      experience: Array.isArray(response.experience) ? response.experience : [],
      projects: Array.isArray(response.projects) ? response.projects : [],
      skills: Array.isArray(response.skills) ? response.skills : [],
      certifications: Array.isArray(response.certifications) ? response.certifications : [],
      achievements: Array.isArray(response.achievements) ? response.achievements : [],
      languages: Array.isArray(response.languages) ? response.languages : [],
      interests: Array.isArray(response.interests) ? response.interests : []
    };

    return res.json({ parsed });
  } catch (error) {
    console.error("Parse resume PDF error:", error);
    if (error.message && error.message.includes("invalid JSON")) {
      return res.status(502).json({ error: "AI returned an invalid response. Please try again." });
    }
    return res.status(500).json({ error: "Failed to parse resume. Please try again later." });
  }
}

module.exports = {
  analyzeResume,
  matchResumeToJob,
  parseResumePdf
};
