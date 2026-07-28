const SECTION_RULES = [
  { key: "personalInfo", label: "Personal Info", points: 10, patterns: [/personal\s+info/i, /profile/i, /name/i] },
  { key: "education", label: "Education", points: 15, patterns: [/education/i, /university/i, /college/i, /degree/i, /bachelor/i, /master/i] },
  { key: "experience", label: "Experience", points: 20, patterns: [/experience/i, /employment/i, /work\s+history/i, /internship/i] },
  { key: "skills", label: "Skills", points: 15, patterns: [/skills/i, /technical\s+skills/i, /technologies/i] },
  { key: "projects", label: "Projects", points: 10, patterns: [/projects/i, /portfolio/i] },
  { key: "certifications", label: "Certifications", points: 5, patterns: [/certifications?/i, /licenses?/i] },
  { key: "achievements", label: "Achievements", points: 5, patterns: [/achievements?/i, /awards?/i, /honou?rs/i] },
  { key: "summary", label: "Summary", points: 10, patterns: [/summary/i, /objective/i, /professional\s+summary/i] },
  { key: "contactDetails", label: "Contact Details", points: 10, patterns: [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, /\+?\d[\d\s().-]{8,}\d/, /linkedin\.com/i, /github\.com/i] }
];

const ACTION_VERBS = [
  "led",
  "built",
  "created",
  "managed",
  "developed",
  "designed",
  "implemented",
  "improved",
  "increased",
  "reduced",
  "streamlined",
  "delivered"
];

function scoreResume(text) {
  const normalizedText = text || "";
  const words = normalizedText.match(/\b[\w'-]+\b/g) || [];
  const wordCount = words.length;
  const missingSections = [];
  const suggestions = [];

  let sectionScore = 0;
  for (const section of SECTION_RULES) {
    const found = section.patterns.some((pattern) => pattern.test(normalizedText));
    if (found) {
      sectionScore += section.points;
    } else {
      missingSections.push(section.label);
      suggestions.push(`Add a clear ${section.label} section.`);
    }
  }

  const wordCountPenalty = wordCount >= 300 && wordCount <= 600 ? 0 : wordCount < 300 || wordCount > 800 ? 10 : 5;
  if (wordCount < 300) {
    suggestions.push("Expand the resume with stronger role details, achievements, and project outcomes.");
  } else if (wordCount > 800) {
    suggestions.push("Shorten the resume by removing low-impact details and duplicate bullets.");
  }

  const actionVerbCount = countMatches(normalizedText, ACTION_VERBS);
  const actionVerbBonus = actionVerbCount >= 3 ? 10 : 0;
  if (!actionVerbBonus) {
    suggestions.push("Use at least three strong action verbs such as Led, Built, Developed, or Improved.");
  }

  const metricCount = (normalizedText.match(/(\b\d+(\.\d+)?%?\b|\b\d+\+\b)/g) || []).length;
  const metricBonus = metricCount >= 2 ? 10 : 0;
  if (!metricBonus) {
    suggestions.push("Add measurable outcomes with numbers, percentages, scale, time saved, or revenue impact.");
  }

  const formattingScore = isCleanExtraction(normalizedText) ? 10 : 0;
  if (!formattingScore) {
    suggestions.push("Use a cleaner PDF layout with selectable text and fewer unusual symbols.");
  }

  const atsScore = clamp(clamp(sectionScore + actionVerbBonus + metricBonus + formattingScore, 0, 100) - wordCountPenalty, 0, 100);
  const contentScore = clamp(clamp(sectionScore + actionVerbBonus + metricBonus, 0, 100) - wordCountPenalty, 0, 100);
  const readabilityScore = calculateReadabilityScore(normalizedText, wordCount);

  return {
    atsScore,
    formattingScore,
    contentScore,
    readabilityScore,
    missingSections,
    suggestions: [...new Set(suggestions)],
    extractedText: normalizedText.slice(0, 500)
  };
}

function countMatches(text, words) {
  return words.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    return count + (text.match(regex) || []).length;
  }, 0);
}

function isCleanExtraction(text) {
  if (!text.trim()) return false;

  const totalLength = text.length;
  const suspiciousChars = (text.match(/[�\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
  const veryLongToken = /\S{45,}/.test(text);
  const suspiciousRatio = suspiciousChars / totalLength;

  return suspiciousRatio < 0.01 && !veryLongToken;
}

function calculateReadabilityScore(text, wordCount) {
  if (!wordCount) return 0;

  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);
  const avgWordsPerSentence = sentences.length ? wordCount / sentences.length : wordCount;

  if (avgWordsPerSentence <= 22) return 90;
  if (avgWordsPerSentence <= 30) return 75;
  if (avgWordsPerSentence <= 40) return 60;
  return 45;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

module.exports = {
  scoreResume
};
