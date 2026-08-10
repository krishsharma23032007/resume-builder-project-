import { api } from "./apiClient";

export interface AnalyzeResult {
  atsScore: number;
  formattingScore: number;
  contentScore: number;
  readabilityScore: number;
  missingSections: string[];
  suggestions: string[];
  extractedText: string;
}

export interface MatchResult {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  experienceGaps: string[];
  recommendations: string[];
}

export type ResumeData = Record<string, unknown>;

export interface ImproveResult {
  improved: string;
  explanation: string;
}

export interface SummaryResult {
  summary: string;
}

export interface CoverLetterResult {
  coverLetter: string;
  tone: string;
}

export interface ParseResult {
  personal: {
    name: string;
    role: string;
    location: string;
    email: string;
    phone: string;
    summary: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  experience: Array<{
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    link: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  interests: Array<{
    name: string;
  }>;
}

export const resumeService = {
  async analyzeResume(file: File): Promise<AnalyzeResult> {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/api/analyze", formData);
  },

  async matchResumeToJob(resumeData: ResumeData, jobDescription: string): Promise<MatchResult> {
    return api.post("/api/match", { resumeData, jobDescription });
  },

  async improveBullet(bullet: string, context?: string, jobTitle?: string): Promise<ImproveResult> {
    return api.post("/api/ai/improve", { bullet, context, jobTitle });
  },

  async generateSummary(resumeData: ResumeData): Promise<SummaryResult> {
    return api.post("/api/ai/summary", { resumeData });
  },

  async generateCoverLetter(
    resumeData: ResumeData,
    jobDescription: string,
    tone: "formal" | "enthusiastic" | "concise" = "formal",
    company?: string,
    jobTitle?: string
  ): Promise<CoverLetterResult> {
    return api.post("/api/ai/cover-letter", { resumeData, jobDescription, tone, company, jobTitle });
  },

  async parseResume(text: string): Promise<{ parsed: ParseResult }> {
    return api.post("/api/ai/parse", { text });
  },

  async parseResumePdf(file: File): Promise<{ parsed: ParseResult }> {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/api/analyze/parse", formData);
  },

  async generatePdf(resumeData: ResumeData, template: string = "classic"): Promise<Blob> {
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "https://ai-resume-backend-pknw.onrender.com").replace(/\/$/, "");
    const { auth } = await import("@/lib/firebase");
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

    const response = await fetch(`${apiBaseUrl}/api/pdf/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ resumeData, template })
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    return response.blob();
  }
};
