const KEYWORDS = [
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "MongoDB",
  "PostgreSQL",
  "Git",
  "Agile",
  "REST API",
  "GraphQL",
  "CI/CD",
  "Linux",
  "Azure",
  "GCP",
  "Machine Learning",
  "Data Analysis",
  "Excel",
  "Tableau",
  "PowerBI",
  "Figma",
  "Sketch",
  "Photoshop",
  "Express",
  "Firebase",
  "Firestore",
  "Next.js",
  "Redux",
  "Tailwind",
  "Jest",
  "Testing",
  "DevOps",
  "Microservices",
  "SaaS"
];

function matchJobDescription(resumeData, jobDescription) {
  const jdText = jobDescription || "";
  const resumeText = flattenResumeData(resumeData);
  const jdKeywords = extractKeywords(jdText);

  if (!jdKeywords.length) {
    return {
      matchPercentage: 0,
      matchedKeywords: [],
      missingKeywords: [],
      skillGaps: [],
      experienceGaps: ["Job description does not include enough recognizable keywords."],
      recommendations: ["Add a detailed job description with required skills and responsibilities."]
    };
  }

  const matchedKeywords = jdKeywords.filter((keyword) => containsKeyword(resumeText, keyword));
  const missingKeywords = jdKeywords.filter((keyword) => !matchedKeywords.includes(keyword));
  const matchPercentage = Math.round((matchedKeywords.length / jdKeywords.length) * 100);

  return {
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    skillGaps: missingKeywords,
    experienceGaps: buildExperienceGaps(missingKeywords, resumeText),
    recommendations: buildRecommendations(matchPercentage, missingKeywords)
  };
}

function extractKeywords(text) {
  const found = KEYWORDS.filter((keyword) => containsKeyword(text, keyword));
  return [...new Set(found)];
}

function containsKeyword(text, keyword) {
  const normalizedText = normalize(text);
  const normalizedKeyword = normalize(keyword);
  return normalizedText.includes(normalizedKeyword);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\bcicd\b/g, "ci/cd")
    .replace(/[^a-z0-9+#/.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenResumeData(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenResumeData).join(" ");
  if (typeof value === "object") return Object.values(value).map(flattenResumeData).join(" ");
  return String(value);
}

function buildExperienceGaps(missingKeywords, resumeText) {
  const gaps = [];

  if (missingKeywords.length) {
    gaps.push(`Resume does not clearly show experience with: ${missingKeywords.slice(0, 8).join(", ")}.`);
  }

  const metricCount = (resumeText.match(/(\b\d+(\.\d+)?%?\b|\b\d+\+\b)/g) || []).length;
  if (metricCount < 2) {
    gaps.push("Experience bullets need more measurable outcomes.");
  }

  return gaps;
}

function buildRecommendations(matchPercentage, missingKeywords) {
  const recommendations = [];

  if (matchPercentage < 70) {
    recommendations.push("Tailor the resume skills and experience sections to the job description.");
  }

  if (missingKeywords.length) {
    recommendations.push(`Add relevant keywords where truthful: ${missingKeywords.slice(0, 8).join(", ")}.`);
  }

  recommendations.push("Mirror important job description language in project and experience bullets when it accurately reflects your work.");
  recommendations.push("Prioritize the most relevant skills near the top of the resume.");

  return recommendations;
}

module.exports = {
  KEYWORDS,
  extractKeywords,
  matchJobDescription
};
