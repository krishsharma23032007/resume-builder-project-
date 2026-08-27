import type { ResumeData } from "@/types/resume";

export type AtsResult = {
  atsScore: number;
  contentScore: number;
  formattingScore: number;
  readabilityScore: number;
  suggestions: string[];
};

const SECTION_RULES = [
  {
    key: "personalInfo",
    label: "Personal Info",
    points: 10,
    contentPatterns: [
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      /\+?\d[\d\s().-]{8,}\d/,
    ],
    required: true,
  },
  {
    key: "education",
    label: "Education",
    points: 15,
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
      /gpa/i,
    ],
    required: true,
  },
  {
    key: "experience",
    label: "Experience",
    points: 20,
    contentPatterns: [
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/i,
      /\b\d{4}\s*[-–]\s*(?:\d{4}|present|current)\b/i,
      /\b(?:intern|junior|senior|lead|manager|director|engineer|developer|analyst|designer)\b/i,
    ],
    required: true,
  },
  {
    key: "skills",
    label: "Skills",
    points: 15,
    contentPatterns: [
      /\b(?:javascript|typescript|python|java|c\+\+|ruby|go|rust|swift|kotlin)\b/i,
      /\b(?:react|angular|vue|node\.?js|express|django|flask|spring|laravel)\b/i,
      /\b(?:aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/cd)\b/i,
      /\b(?:sql|mongodb|postgresql|mysql|redis|elasticsearch|firebase)\b/i,
      /\b(?:html|css|sass|tailwind|bootstrap|figma|sketch)\b/i,
      /\b(?:git|github|gitlab|jira|agile|scrum)\b/i,
    ],
    required: true,
  },
  {
    key: "projects",
    label: "Projects",
    points: 10,
    contentPatterns: [/github\.com/i, /https?:\/\/[^\s]+/i],
    required: false,
  },
  {
    key: "certifications",
    label: "Certifications",
    points: 5,
    contentPatterns: [
      /aws\s+certified/i,
      /google\s+cloud/i,
      /azure\s+certified/i,
      /cisco\s+certified/i,
      /comptia/i,
      /pmp\s+certified/i,
      /certified\s+scrum/i,
    ],
    required: false,
  },
  {
    key: "achievements",
    label: "Achievements",
    points: 5,
    contentPatterns: [
      /won\s+(?:\w+\s+)?award/i,
      /received\s+(?:\w+\s+)?award/i,
      /awarded/i,
      /first\s+place/i,
      /top\s+\d+/i,
      /recognized\s+for/i,
    ],
    required: false,
  },
  {
    key: "summary",
    label: "Professional Summary",
    points: 10,
    contentPatterns: [],
    required: false,
  },
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
  "mobilized", "modernized", "navigated", "outperformed",
  "quantified", "rationalized", "restructured", "simplified", "solidified",
  "standardized", "strengthened", "succeeded", "surpassed", "systematized",
];

const QUANTIFIABLE_PATTERNS = [
  /\b\d+(\.\d+)?%/g,
  /\$[\d,.]+[KMB]?/gi,
  /\b\d+\+?\s*(?:users?|customers?|clients?|people|team\s*members?|employees?)/gi,
  /\b\d+\s*(?:x|times)\b/gi,
  /\b(?:increased|reduced|improved|decreased|grew|saved|boosted|cut)\s+.*?\b\d+/gi,
  /\b\d+\+?\s*(?:projects?|features?|products?|applications?|systems?|services?)/gi,
  /\b\d+\+?\s*(?:years?|months?)\s+(?:of\s+)?(?:experience|exp)/gi,
];

function resumeDataToText(data: ResumeData): string {
  const parts: string[] = [];

  if (data.personal) {
    const p = data.personal;
    parts.push([p.name, p.role, p.summary, p.email, p.phone, p.location].filter(Boolean).join(" "));
  }

  for (const exp of data.experience) {
    parts.push([exp.company, exp.title, exp.location, exp.description, ...exp.bullets].filter(Boolean).join(" "));
  }

  for (const edu of data.education) {
    parts.push([edu.institution, edu.degree, edu.field, edu.gpa].filter(Boolean).join(" "));
  }

  for (const proj of data.projects) {
    parts.push([proj.name, proj.description, proj.technologies, ...proj.bullets].filter(Boolean).join(" "));
  }

  for (const skill of data.skills) {
    parts.push([skill.category, ...skill.items].filter(Boolean).join(" "));
  }

  for (const cert of data.certifications) {
    parts.push([cert.name, cert.issuer].filter(Boolean).join(" "));
  }

  for (const ach of data.achievements) {
    parts.push([ach.title, ach.description].filter(Boolean).join(" "));
  }

  for (const resp of data.responsibilities) {
    parts.push([resp.role, resp.organization, resp.description].filter(Boolean).join(" "));
  }

  return parts.join(" ");
}

function countMatches(text: string, words: string[]): number {
  return words.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    return count + (text.match(regex) || []).length;
  }, 0);
}

function countQuantifiables(text: string): number {
  let count = 0;
  for (const pattern of QUANTIFIABLE_PATTERNS) {
    const matches = text.match(pattern) || [];
    count += matches.length;
  }
  return count;
}

function calculateReadabilityScore(wordCount: number, sentenceCount: number): number {
  if (!wordCount || !sentenceCount) return 50;
  const avg = wordCount / sentenceCount;
  if (avg <= 15) return 95;
  if (avg <= 20) return 85;
  if (avg <= 25) return 75;
  if (avg <= 30) return 65;
  if (avg <= 35) return 55;
  return 45;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function scoreResumeLive(data: ResumeData): AtsResult {
  const text = resumeDataToText(data);
  const words = text.match(/\b[\w'-]+\b/g) || [];
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;

  const suggestions: string[] = [];

  // Section detection
  let sectionScore = 0;
  const hasPersonal = Boolean(data.personal?.email || data.personal?.phone);
  const hasEducation = data.education.length > 0;
  const hasExperience = data.experience.length > 0;
  const hasSkills = data.skills.length > 0;
  const hasProjects = data.projects.length > 0;
  const hasCertifications = data.certifications.length > 0;
  const hasAchievements = data.achievements.length > 0;
  const hasSummary = Boolean(data.personal?.summary?.trim());

  const sectionChecks = [
    { rule: SECTION_RULES[0], found: hasPersonal },
    { rule: SECTION_RULES[1], found: hasEducation },
    { rule: SECTION_RULES[2], found: hasExperience },
    { rule: SECTION_RULES[3], found: hasSkills },
    { rule: SECTION_RULES[4], found: hasProjects },
    { rule: SECTION_RULES[5], found: hasCertifications },
    { rule: SECTION_RULES[6], found: hasAchievements },
    { rule: SECTION_RULES[7], found: hasSummary },
  ];

  for (const check of sectionChecks) {
    if (check.found) {
      if (check.rule.contentPatterns.length === 0) {
        // No content patterns to validate (e.g. summary) — award points for presence
        sectionScore += check.rule.points;
      } else {
        // Only award points when content patterns match
        const contentMatch = check.rule.contentPatterns.some((p) => p.test(text));
        if (contentMatch) {
          sectionScore += check.rule.points;
        } else {
          suggestions.push(`Add relevant content to your "${check.rule.label}" section (e.g. keywords, details).`);
        }
      }
    } else if (check.rule.required) {
      suggestions.push(`Add a "${check.rule.label}" section to improve ATS compatibility.`);
    }
  }

  // Word count (max 15)
  let wordCountScore = 0;
  if (wordCount >= 300 && wordCount <= 800) {
    wordCountScore = 15;
  } else if (wordCount >= 200 && wordCount < 300) {
    wordCountScore = 10;
    suggestions.push("Add more details about your experience.");
  } else if (wordCount > 800 && wordCount <= 1000) {
    wordCountScore = 10;
    suggestions.push("Resume is getting long. Consider trimming to 1-2 pages.");
  } else if (wordCount > 1000) {
    wordCountScore = 5;
    suggestions.push("Resume exceeds recommended length. Trim to 1-2 pages.");
  } else if (wordCount >= 100 && wordCount < 200) {
    wordCountScore = 5;
    suggestions.push("Resume is too short. Add more details.");
  } else {
    wordCountScore = 0;
    suggestions.push("A good resume should have 300-800 words.");
  }

  // Action verbs (max 15)
  const actionVerbCount = countMatches(text, ACTION_VERBS);
  let actionVerbScore = 0;
  if (actionVerbCount >= 8) actionVerbScore = 15;
  else if (actionVerbCount >= 5) actionVerbScore = 12;
  else if (actionVerbCount >= 3) actionVerbScore = 8;
  else if (actionVerbCount >= 1) actionVerbScore = 4;
  else suggestions.push("Use more action verbs like Led, Built, Developed, Implemented.");

  // Quantifiable achievements (max 15)
  const quantifiableCount = countQuantifiables(text);
  let metricScore = 0;
  if (quantifiableCount >= 5) metricScore = 15;
  else if (quantifiableCount >= 3) metricScore = 12;
  else if (quantifiableCount >= 2) metricScore = 8;
  else if (quantifiableCount >= 1) metricScore = 4;
  else suggestions.push("Add measurable outcomes with numbers or percentages.");

  // Formatting (max 10) - structured data is always well-formatted
  const formattingScore = 10;

  // Bullet points (max 10)
  const bulletCount = data.experience.reduce((c, e) => c + e.bullets.length, 0)
    + data.projects.reduce((c, p) => c + p.bullets.length, 0);
  let bulletScore = 0;
  if (bulletCount >= 8) bulletScore = 10;
  else if (bulletCount >= 5) bulletScore = 7;
  else if (bulletCount >= 2) bulletScore = 4;
  else if (bulletCount >= 1) bulletScore = 2;
  else suggestions.push("Use bullet points to describe your experience and achievements.");

  // Date consistency (max 5)
  const hasDates = data.experience.some((e) => e.startDate || e.endDate)
    || data.education.some((e) => e.startDate || e.endDate);
  const dateScore = hasDates ? 5 : 0;
  if (!hasDates) suggestions.push("Add dates to your experience and education entries.");

  // Calculate final scores
  const rawScore = sectionScore + wordCountScore + actionVerbScore + metricScore + formattingScore + bulletScore + dateScore;
  const atsScore = clamp(Math.round((rawScore / 110) * 100), 0, 100);

  const contentScore = clamp(
    Math.round((sectionScore / 90) * 40 + (actionVerbScore / 15) * 30 + (metricScore / 15) * 30),
    0,
    100
  );

  const readabilityScore = calculateReadabilityScore(wordCount, sentenceCount);

  return {
    atsScore,
    contentScore,
    formattingScore: formattingScore * 10,
    readabilityScore,
    suggestions: [...new Set(suggestions)].slice(0, 5),
  };
}
