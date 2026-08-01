const { scoreResume } = require("../utils/atsScorer");
const { matchJobDescription } = require("../utils/jdMatcher");
const { extractPdfText } = require("../utils/pdfParser");

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

module.exports = {
  analyzeResume,
  matchResumeToJob
};
