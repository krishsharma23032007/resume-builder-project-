const KEYWORDS = [
  "React", "Node.js", "Python", "Java", "SQL", "AWS", "Docker", "Kubernetes",
  "TypeScript", "JavaScript", "HTML", "CSS", "MongoDB", "PostgreSQL", "Git",
  "Agile", "REST API", "GraphQL", "CI/CD", "Linux", "Azure", "GCP",
  "Machine Learning", "Data Analysis", "Excel", "Tableau", "PowerBI",
  "Figma", "Sketch", "Photoshop", "Express", "Firebase", "Firestore",
  "Next.js", "Redux", "Tailwind", "Jest", "Testing", "DevOps",
  "Microservices", "SaaS", "C++", "C#", "Ruby", "Go", "Rust", "Swift",
  "Kotlin", "PHP", "Laravel", "Django", "Flask", "Spring", "Angular",
  "Vue", "Svelte", "Webpack", "Vite", "Nginx", "Apache", "Redis",
  "Elasticsearch", "Kafka", "RabbitMQ", "Terraform", "Jenkins", "GitHub",
  "GitLab", "Jira", "Confluence", "Scrum", "Kanban", "REST", "SOAP",
  "GraphQL", "gRPC", "WebSocket", "OAuth", "JWT", "SSL", "TLS",
  "Microservices", "Serverless", "Lambda", "EC2", "S3", "RDS",
  "DynamoDB", "CloudFormation", "ECS", "EKS", "Fargate",
  "Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch",
  "NLP", "Computer Vision", "Deep Learning", "AI", "ML",
  "Data Science", "Data Engineering", "ETL", "Spark", "Hadoop",
  "Power BI", "Looker", "Metabase", "Analytics", "Visualization",
  "Product Management", "Project Management", "Stakeholder",
  "Communication", "Leadership", "Team Management", "Mentoring",
  "Problem Solving", "Critical Thinking", "Collaboration"
];

/**
 * Extracts meaningful keywords from job description text.
 * Goes beyond the hardcoded list to find skills, technologies, and requirements.
 */
function extractKeywordsFromText(text) {
  const normalized = text.toLowerCase();
  const found = new Set();

  // Match from hardcoded list
  for (const keyword of KEYWORDS) {
    if (normalized.includes(keyword.toLowerCase())) {
      found.add(keyword);
    }
  }

  // Extract capitalized terms (likely skills/technologies)
  const capitalizedTerms = text.match(/\b[A-Z][a-zA-Z+#.]{2,}\b/g) || [];
  for (const term of capitalizedTerms) {
    if (term.length >= 3 && term.length <= 30) {
      found.add(term);
    }
  }

  // Extract common patterns like "X years of experience"
  const yearPatterns = text.match(/\d+\+?\s*years?\s+(?:of\s+)?(?:experience|exp)\s+(?:in|with)\s+([^,.]+)/gi) || [];
  for (const match of yearPatterns) {
    const skills = match.replace(/\d+\+?\s*years?\s+(?:of\s+)?(?:experience|exp)\s+(?:in|with)\s+/i, '').trim();
    found.add(skills);
  }

  // Extract bullet point items (often requirements)
  const bulletItems = text.match(/(?:^|\n)\s*[•\-\*]\s*(.+?)(?:\n|$)/gm) || [];
  for (const item of bulletItems) {
    const cleaned = item.replace(/^[•\-\*\s]+/, '').trim();
    if (cleaned.length >= 3 && cleaned.length <= 50) {
      // Extract the main noun/phrase
      const words = cleaned.split(/\s+/).slice(0, 3).join(' ');
      if (words.length >= 3) {
        found.add(words);
      }
    }
  }

  return [...found];
}

function matchJobDescription(resumeData, jobDescription) {
  const jdText = jobDescription || "";
  const resumeText = flattenResumeData(resumeData);
  const jdKeywords = extractKeywordsFromText(jdText);

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

  const matchedKeywords = [];
  const missingKeywords = [];

  for (const keyword of jdKeywords) {
    if (containsKeyword(resumeText, keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const matchPercentage = Math.round((matchedKeywords.length / jdKeywords.length) * 100);

  return {
    matchPercentage,
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 20),
    skillGaps: missingKeywords.slice(0, 10),
    experienceGaps: buildExperienceGaps(missingKeywords, resumeText),
    recommendations: buildRecommendations(matchPercentage, missingKeywords)
  };
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
  extractKeywordsFromText,
  matchJobDescription
};
