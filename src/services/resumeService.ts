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
    tone: "formal" | "enthusiastic" | "concise" = "formal"
  ): Promise<CoverLetterResult> {
    return api.post("/api/ai/cover-letter", { resumeData, jobDescription, tone });
  }
};
