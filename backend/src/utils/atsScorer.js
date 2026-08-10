/**
 * ATS Resume Scorer
 * Analyzes resume text and provides detailed scoring breakdown.
 */

const SECTION_RULES = [
  {
    key: "personalInfo",
    label: "Personal Info",
    points: 10,
    patterns: [
      /personal\s+info/i,
      /profile/i,
      /contact/i,
      /about\s+me/i,
      /name/i
    ],
    contentPatterns: [
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      /\+?\d[\d\s().-]{8,}\d/,
      /linkedin\.com/i,
      /github\.com/i
    ]
  },
  {
    key: "education",
    label: "Education",
    points: 15,
    patterns: [
      /education/i,
      /academic/i,
      /university/i,
      /college/i,
      /school/i,
      /institute/i
    ],
    contentPatterns: [
      /degree/i,
      /bachelor/i,
      /master/i,
      /ph\.?d/i,
      /b\.?s\.?/i,
      /m\.?s\.?/i,
      /b\.?a\.?/i,
      /m\.?a\.?/i,
      /gpa/i,
      /major/i,
      /minor/i
    ]
  },
  {
    key: "experience",
    label: "Experience",
    points: 20,
    patterns: [
      /experience/i,
      /employment/i,
      /work\s+history/i,
      /professional\s+experience/i,
      /career/i
    ],
    contentPatterns: [
      /internship/i,
      /full[\s-]time/i,
      /part[\s-]time/i,
      /contract/i,
      /freelance/i,
      /junior/i,
      /senior/i,
      /lead/i,
      /manager/i,
      /director/i
    ]
  },
  {
    key: "skills",
    label: "Skills",
    points: 15,
    patterns: [
      /skills/i,
      /technical\s+skills/i,
      /technologies/i,
      /competencies/i,
      /expertise/i,
      /proficiencies/i
    ],
    contentPatterns: [
      /javascript/i,
      /python/i,
      /java(?!script)/i,
      /react/i,
      /node/i,
      /sql/i,
      /html/i,
      /css/i,
      /aws/i,
      /docker/i,
      /git/i,
      /typescript/i
    ]
  },
  {
    key: "projects",
    label: "Projects",
    points: 10,
    patterns: [
      /projects/i,
      /portfolio/i,
      /personal\s+projects/i,
      /side\s+projects/i,
      /open[\s-]source/i
    ],
    contentPatterns: [
      /github\.com/i,
      /deployed/i,
      /built/i,
      /created/i,
      /developed/i
    ]
  },
  {
    key: "certifications",
    label: "Certifications",
    points: 5,
    patterns: [
      /certifications?/i,
      /licenses?/i,
      /credentials?/i,
      /accreditations?/i
    ],
    contentPatterns: [
      /aws\s+certified/i,
      /google\s+cloud/i,
      /azure/i,
      /cisco/i,
      /comptia/i,
      /pmp/i,
      /scrum/i
    ]
  },
  {
    key: "achievements",
    label: "Achievements",
    points: 5,
    patterns: [
      /achievements?/i,
      /awards?/i,
      /honou?rs/i,
      /accomplishments?/i,
      /recognition/i
    ],
    contentPatterns: [
      /won/i,
      /received/i,
      /awarded/i,
      /first\s+place/i,
      /top\s+\d+/i,
      /winner/i
    ]
  },
  {
    key: "summary",
    label: "Professional Summary",
    points: 10,
    patterns: [
      /summary/i,
      /objective/i,
      /professional\s+summary/i,
      /career\s+objective/i,
      /profile\s+summary/i,
      /about/i
    ],
    contentPatterns: []
  },
  {
    key: "contactDetails",
    label: "Contact Details",
    points: 10,
    patterns: [
      /contact/i,
      /get\s+in\s+touch/i,
      /reach\s+out/i
    ],
    contentPatterns: [
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      /\+?\d[\d\s().-]{8,}\d/,
      /linkedin\.com/i,
      /github\.com/i,
      /portfolio/i,
      /website/i
    ]
  }
];

const ACTION_VERBS = [
  "led", "built", "created", "managed", "developed", "designed",
  "implemented", "improved", "increased", "reduced", "streamlined",
  "delivered", "launched", "optimized", "automated", "architected",
  "coordinated", "directed", "established", "executed", "facilitated",
  "generated", "initiated", "introduced", "maintained", "negotiated",
  "orchestrated", "pioneered", "proposed", "redesigned", "refactored",
  "reorganized", "resolved", "revamped", "spearheaded", "supervised",
  "transformed", "unified", "upgraded"
];

const QUANTIFIABLE_PATTERNS = [
  /\b\d+(\.\d+)?%/g,                    // Percentages
  /\$\d[\d,.]*\d/g,                      // Dollar amounts
  /\b\d+\+?\s*(users?|customers?|clients?|people|team\s*members?)/gi, // User counts
  /\b\d+\s*(x|times)\b/gi,              // Multipliers
  /\b(increased|reduced|improved|decreased|grew|saved)\s+.*?\b\d+/gi, // Impact with numbers
  /\b\d+\+?\s*(projects?|features?|products?|applications?|systems?)/gi // Project counts
];

/**
 * Scores a resume based on extracted text.
 * Returns detailed scoring breakdown with suggestions.
 */
function scoreResume(text) {
  const normalizedText = text || "";
  const words = normalizedText.match(/\b[\w'-]+\b/g) || [];
  const wordCount = words.length;
  const sentences = normalizedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  const missingSections = [];
  const suggestions = [];
  const sectionBreakdown = [];

  // Section detection
  let sectionScore = 0;
  for (const section of SECTION_RULES) {
    const headerFound = section.patterns.some(pattern => pattern.test(normalizedText));
    const contentFound = section.contentPatterns.some(pattern => pattern.test(normalizedText));
    const found = headerFound || contentFound;

    if (found) {
      sectionScore += section.points;
      sectionBreakdown.push({
        key: section.key,
        label: section.label,
        score: section.points,
        maxScore: section.points,
        found: true
      });
    } else {
      missingSections.push(section.label);
      suggestions.push(`Add a clear ${section.label} section to improve ATS compatibility.`);
      sectionBreakdown.push({
        key: section.key,
        label: section.label,
        score: 0,
        maxScore: section.points,
        found: false
      });
    }
  }

  // Word count analysis
  let wordCountScore = 10;
  if (wordCount < 200) {
    wordCountScore = 0;
    suggestions.push("Resume is too short. Add more details about your experience, skills, and achievements.");
  } else if (wordCount < 300) {
    wordCountScore = 5;
    suggestions.push("Consider expanding your resume with more role details and achievements.");
  } else if (wordCount > 1000) {
    wordCountScore = 0;
    suggestions.push("Resume exceeds recommended length. Trim to 1-2 pages for best ATS results.");
  } else if (wordCount > 800) {
    wordCountScore = 5;
    suggestions.push("Resume is quite long. Consider removing low-impact details to keep it concise.");
  }

  // Action verb analysis
  const actionVerbCount = countMatches(normalizedText, ACTION_VERBS);
  const actionVerbScore = actionVerbCount >= 5 ? 10 : actionVerbCount >= 3 ? 7 : actionVerbCount >= 1 ? 3 : 0;
  if (actionVerbScore < 7) {
    suggestions.push("Use more strong action verbs like Led, Built, Developed, Implemented, or Optimized.");
  }

  // Quantifiable achievements
  const quantifiableCount = countQuantifiables(normalizedText);
  const metricScore = quantifiableCount >= 4 ? 10 : quantifiableCount >= 2 ? 7 : quantifiableCount >= 1 ? 3 : 0;
  if (metricScore < 7) {
    suggestions.push("Add measurable outcomes with numbers, percentages, revenue impact, or time saved.");
  }

  // Formatting analysis
  const formattingIssues = analyzeFormatting(normalizedText);
  const formattingScore = formattingIssues.length === 0 ? 10 : formattingIssues.length <= 2 ? 5 : 0;
  if (formattingScore < 10) {
    suggestions.push(...formattingIssues.map(issue => `Formatting: ${issue}`));
  }

  // Readability analysis
  const readabilityScore = calculateReadabilityScore(normalizedText, wordCount, sentenceCount);
  if (readabilityScore < 70) {
    suggestions.push("Improve readability by using shorter sentences and clearer structure.");
  }

  // Calculate final scores
  const contentScore = clamp(sectionScore + actionVerbScore + metricScore, 0, 100);
  const atsScore = clamp(
    sectionScore + actionVerbScore + metricScore + formattingScore + wordCountScore,
    0, 100
  );

  return {
    atsScore,
    contentScore,
    formattingScore,
    readabilityScore,
    wordCount,
    sentenceCount,
    pageCount: estimatePageCount(wordCount),
    missingSections,
    suggestions: [...new Set(suggestions)].slice(0, 10),
    sectionBreakdown,
    actionVerbCount,
    quantifiableCount,
    extractedText: normalizedText.slice(0, 500)
  };
}

/**
 * Counts occurrences of action verbs in text.
 */
function countMatches(text, words) {
  return words.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    return count + (text.match(regex) || []).length;
  }, 0);
}

/**
 * Counts quantifiable achievements in text.
 */
function countQuantifiables(text) {
  let count = 0;
  for (const pattern of QUANTIFIABLE_PATTERNS) {
    const matches = text.match(pattern) || [];
    count += matches.length;
  }
  return count;
}

/**
 * Analyzes formatting issues in the resume text.
 */
function analyzeFormatting(text) {
  const issues = [];

  // Check for suspicious characters
  const suspiciousChars = (text.match(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
  if (suspiciousChars > 5) {
    issues.push("Contains unusual characters that may affect ATS parsing.");
  }

  // Check for very long tokens (might indicate formatting issues)
  const longTokens = (text.match(/\S{50,}/g) || []).length;
  if (longTokens > 0) {
    issues.push("Contains very long words without spaces, which may indicate formatting issues.");
  }

  // Check for excessive special characters
  const specialCharRatio = (text.match(/[^a-zA-Z0-9\s.,;:!?'"()\-@]/g) || []).length / text.length;
  if (specialCharRatio > 0.05) {
    issues.push("Contains many special characters. Use standard formatting for better ATS compatibility.");
  }

  // Check for consistent date formats
  const dateFormats = text.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/gi) || [];
  const yearFormats = text.match(/\b\d{4}\s*[-–]\s*(?:\d{4}|present|current)\b/gi) || [];
  if (dateFormats.length > 0 && yearFormats.length > 0) {
    // Mixed date formats - not necessarily an issue
  }

  return issues;
}

/**
 * Calculates readability score based on sentence length.
 */
function calculateReadabilityScore(text, wordCount, sentenceCount) {
  if (!wordCount || !sentenceCount) return 50;

  const avgWordsPerSentence = wordCount / sentenceCount;

  if (avgWordsPerSentence <= 15) return 95;
  if (avgWordsPerSentence <= 20) return 85;
  if (avgWordsPerSentence <= 25) return 75;
  if (avgWordsPerSentence <= 30) return 65;
  if (avgWordsPerSentence <= 35) return 55;
  return 45;
}

/**
 * Estimates page count based on word count.
 * Average resume: 300-500 words per page.
 */
function estimatePageCount(wordCount) {
  if (wordCount <= 0) return 0;
  if (wordCount <= 400) return 1;
  if (wordCount <= 800) return 2;
  return Math.ceil(wordCount / 400);
}

/**
 * Clamps a value between min and max.
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

module.exports = {
  scoreResume
};
