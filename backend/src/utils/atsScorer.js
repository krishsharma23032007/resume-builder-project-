/**
 * ATS Resume Scorer
 * Analyzes resume text and provides detailed scoring breakdown.
 * Scores are calibrated to be realistic and meaningful.
 */

const SECTION_RULES = [
  {
    key: "personalInfo",
    label: "Personal Info",
    points: 10,
    patterns: [
      /personal\s+info/i,
      /contact\s+info/i,
      /about\s+me/i
    ],
    contentPatterns: [
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      /\+?\d[\d\s().-]{8,}\d/
    ],
    required: true
  },
  {
    key: "education",
    label: "Education",
    points: 15,
    patterns: [
      /^education$/im,
      /^academic\s+background$/im,
      /^educational\s+background$/im
    ],
    contentPatterns: [
      /bachelor/i,
      /master/i,
      /ph\.?d/i,
      /b\.?s\.?/i,
      /m\.?s\.?/i,
      /b\.?a\.?/i,
      /m\.?a\.?/i,
      /university/i,
      /college/i,
      /institute/i,
      /gpa/i
    ],
    required: true
  },
  {
    key: "experience",
    label: "Experience",
    points: 20,
    patterns: [
      /^experience$/im,
      /^work\s+experience$/im,
      /^professional\s+experience$/im,
      /^employment\s+history$/im,
      /^work\s+history$/im
    ],
    contentPatterns: [
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/i,
      /\b\d{4}\s*[-–]\s*(?:\d{4}|present|current)\b/i,
      /\b(?:intern|junior|senior|lead|manager|director|engineer|developer|analyst|designer)\b/i
    ],
    required: true
  },
  {
    key: "skills",
    label: "Skills",
    points: 15,
    patterns: [
      /^skills$/im,
      /^technical\s+skills$/im,
      /^core\s+competencies$/im,
      /^technologies$/im,
      /^proficiencies$/im
    ],
    contentPatterns: [
      /\b(?:javascript|typescript|python|java|c\+\+|ruby|go|rust|swift|kotlin)\b/i,
      /\b(?:react|angular|vue|node\.?js|express|django|flask|spring|laravel)\b/i,
      /\b(?:aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/cd)\b/i,
      /\b(?:sql|mongodb|postgresql|mysql|redis|elasticsearch|firebase)\b/i,
      /\b(?:html|css|sass|tailwind|bootstrap|figma|sketch)\b/i,
      /\b(?:git|github|gitlab|jira|agile|scrum)\b/i
    ],
    required: true
  },
  {
    key: "projects",
    label: "Projects",
    points: 10,
    patterns: [
      /^projects$/im,
      /^personal\s+projects$/im,
      /^key\s+projects$/im,
      /^portfolio$/im
    ],
    contentPatterns: [
      /github\.com/i,
      /https?:\/\/[^\s]+/i
    ],
    required: false
  },
  {
    key: "certifications",
    label: "Certifications",
    points: 5,
    patterns: [
      /^certifications?$/im,
      /^licenses?\s*(?:&|and)\s*certifications?$/im,
      /^credentials?$/im
    ],
    contentPatterns: [
      /aws\s+certified/i,
      /google\s+cloud/i,
      /azure\s+certified/i,
      /cisco\s+certified/i,
      /comptia/i,
      /pmp\s+certified/i,
      /certified\s+scrum/i
    ],
    required: false
  },
  {
    key: "achievements",
    label: "Achievements",
    points: 5,
    patterns: [
      /^achievements?$/im,
      /^awards?\s*(?:&|and)\s*honors?$/im,
      /^honors?\s*(?:&|and)\s*awards?$/im,
      /^accomplishments?$/im
    ],
    contentPatterns: [
      /won\s+(?:\w+\s+)?award/i,
      /received\s+(?:\w+\s+)?award/i,
      /awarded/i,
      /first\s+place/i,
      /top\s+\d+/i,
      /recognized\s+for/i
    ],
    required: false
  },
  {
    key: "summary",
    label: "Professional Summary",
    points: 10,
    patterns: [
      /^summary$/im,
      /^professional\s+summary$/im,
      /^career\s+objective$/im,
      /^objective$/im,
      /^profile$/im,
      /^about$/im
    ],
    contentPatterns: [],
    required: false
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
  "transformed", "unified", "upgraded", "achieved", "accelerated",
  "consolidated", "decreased", "eliminated", "expanded", "formulated",
  "harnessed", "innovated", "integrated", "maximized", "mentored",
  "mobilized", "modernized", "navigated", "outperformed", "pioneered",
  "quantified", "rationalized", "restructured", "simplified", "solidified",
  "standardized", "strengthened", "succeeded", "surpassed", "systematized"
];

const QUANTIFIABLE_PATTERNS = [
  /\b\d+(\.\d+)?%/g,                    // Percentages
  /\$[\d,.]+[KMB]?/gi,                   // Dollar amounts
  /\b\d+\+?\s*(?:users?|customers?|clients?|people|team\s*members?|employees?)/gi,
  /\b\d+\s*(?:x|times)\b/gi,            // Multipliers
  /\b(?:increased|reduced|improved|decreased|grew|saved|boosted|cut)\s+.*?\b\d+/gi,
  /\b\d+\+?\s*(?:projects?|features?|products?|applications?|systems?|services?)/gi,
  /\b\d+\+?\s*(?:years?|months?)\s+(?:of\s+)?(?:experience|exp)/gi
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

  // Section detection - use both header and content patterns
  let sectionScore = 0;
  let sectionsFound = 0;

  for (const section of SECTION_RULES) {
    const headerFound = section.patterns.some(pattern => pattern.test(normalizedText));
    const contentFound = section.contentPatterns.some(pattern => pattern.test(normalizedText));
    const found = headerFound || contentFound;

    if (found) {
      // Give partial credit if only content found (no clear header)
      const score = headerFound ? section.points : Math.round(section.points * 0.6);
      sectionScore += score;
      sectionsFound++;
      sectionBreakdown.push({
        key: section.key,
        label: section.label,
        score: score,
        maxScore: section.points,
        found: true,
        headerFound
      });
    } else {
      if (section.required) {
        missingSections.push(section.label);
        suggestions.push(`Add a clear "${section.label}" section to improve ATS compatibility.`);
      }
      sectionBreakdown.push({
        key: section.key,
        label: section.label,
        score: 0,
        maxScore: section.points,
        found: false,
        headerFound: false
      });
    }
  }

  // Word count analysis (max 15 points)
  let wordCountScore = 0;
  if (wordCount >= 300 && wordCount <= 800) {
    wordCountScore = 15;
  } else if (wordCount >= 200 && wordCount < 300) {
    wordCountScore = 10;
    suggestions.push("Consider expanding your resume with more details about your experience.");
  } else if (wordCount > 800 && wordCount <= 1000) {
    wordCountScore = 10;
    suggestions.push("Resume is getting long. Consider trimming to 1-2 pages.");
  } else if (wordCount > 1000) {
    wordCountScore = 5;
    suggestions.push("Resume exceeds recommended length. Trim to 1-2 pages for best ATS results.");
  } else if (wordCount >= 100 && wordCount < 200) {
    wordCountScore = 5;
    suggestions.push("Resume is too short. Add more details about your experience, skills, and achievements.");
  } else if (wordCount < 100) {
    wordCountScore = 0;
    suggestions.push("Resume is too short. A good resume should have 300-800 words.");
  }

  // Action verb analysis (max 15 points)
  const actionVerbCount = countMatches(normalizedText, ACTION_VERBS);
  let actionVerbScore = 0;
  if (actionVerbCount >= 8) {
    actionVerbScore = 15;
  } else if (actionVerbCount >= 5) {
    actionVerbScore = 12;
  } else if (actionVerbCount >= 3) {
    actionVerbScore = 8;
  } else if (actionVerbCount >= 1) {
    actionVerbScore = 4;
  } else {
    actionVerbScore = 0;
    suggestions.push("Use more strong action verbs like Led, Built, Developed, Implemented, or Optimized.");
  }

  // Quantifiable achievements (max 15 points)
  const quantifiableCount = countQuantifiables(normalizedText);
  let metricScore = 0;
  if (quantifiableCount >= 5) {
    metricScore = 15;
  } else if (quantifiableCount >= 3) {
    metricScore = 12;
  } else if (quantifiableCount >= 2) {
    metricScore = 8;
  } else if (quantifiableCount >= 1) {
    metricScore = 4;
  } else {
    metricScore = 0;
    suggestions.push("Add measurable outcomes with numbers, percentages, revenue impact, or time saved.");
  }

  // Formatting analysis (max 10 points)
  const formattingIssues = analyzeFormatting(normalizedText);
  let formattingScore = 10;
  if (formattingIssues.length > 3) {
    formattingScore = 3;
    suggestions.push("Fix formatting issues for better ATS compatibility.");
  } else if (formattingIssues.length > 0) {
    formattingScore = 7;
  }
  suggestions.push(...formattingIssues.map(issue => `Formatting: ${issue}`));

  // Bullet point analysis (max 10 points)
  const bulletCount = (normalizedText.match(/^\s*[•\-\*]\s+/gm) || []).length;
  let bulletScore = 0;
  if (bulletCount >= 8) {
    bulletScore = 10;
  } else if (bulletCount >= 5) {
    bulletScore = 7;
  } else if (bulletCount >= 2) {
    bulletScore = 4;
  } else if (bulletCount >= 1) {
    bulletScore = 2;
  } else {
    bulletScore = 0;
    suggestions.push("Use bullet points to describe your experience and achievements.");
  }

  // Date consistency (max 5 points)
  const datePatterns = normalizedText.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi) || [];
  const yearRanges = normalizedText.match(/\b\d{4}\s*[-–]\s*(?:\d{4}|present|current)\b/gi) || [];
  let dateScore = 0;
  if (datePatterns.length > 0 || yearRanges.length > 0) {
    dateScore = 5;
  } else {
    dateScore = 0;
    suggestions.push("Add dates to your experience and education entries.");
  }

  // Calculate final scores
  const maxPossible = 100;
  const rawScore = sectionScore + wordCountScore + actionVerbScore + metricScore + formattingScore + bulletScore + dateScore;
  const atsScore = clamp(Math.round((rawScore / 110) * 100), 0, 100);

  // Content score focuses on quality of content
  const contentScore = clamp(
    Math.round(((sectionScore / 90) * 40) + ((actionVerbScore / 15) * 30) + ((metricScore / 15) * 30)),
    0, 100
  );

  // Readability score
  const readabilityScore = calculateReadabilityScore(normalizedText, wordCount, sentenceCount);

  return {
    atsScore,
    contentScore,
    formattingScore: formattingScore * 10, // Convert to percentage
    readabilityScore,
    wordCount,
    sentenceCount,
    pageCount: estimatePageCount(wordCount),
    missingSections,
    suggestions: [...new Set(suggestions)].slice(0, 8),
    sectionBreakdown,
    actionVerbCount,
    quantifiableCount,
    bulletCount,
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
  const specialCharRatio = (text.match(/[^a-zA-Z0-9\s.,;:!?'"()\-@/]/g) || []).length / Math.max(text.length, 1);
  if (specialCharRatio > 0.05) {
    issues.push("Contains many special characters. Use standard formatting.");
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
  return Math.max(min, Math.min(max, value));
}

module.exports = {
  scoreResume
};
