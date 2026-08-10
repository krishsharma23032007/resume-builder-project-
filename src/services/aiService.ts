import { api } from "./apiClient";

interface ImproveBulletPayload {
  bullet: string;
  context?: string;
  jobTitle?: string;
}

interface ImproveBulletResponse {
  improved: string;
  explanation: string;
}

interface FixGrammarPayload {
  text: string;
}

interface FixGrammarResponse {
  corrected: string;
  changes: string;
}

interface SuggestAchievementsPayload {
  role: string;
  context?: string;
  type?: "experience" | "project";
}

interface SuggestAchievementsResponse {
  suggestions: string[];
}

interface GenerateSummaryPayload {
  resumeData: Record<string, unknown>;
}

interface GenerateSummaryResponse {
  summary: string;
}

interface GenerateCoverLetterPayload {
  resumeData: Record<string, unknown>;
  jobDescription: string;
  tone?: "formal" | "enthusiastic" | "concise";
  company?: string;
  jobTitle?: string;
}

interface GenerateCoverLetterResponse {
  coverLetter: string;
  tone: string;
}

export const aiService = {
  improveBullet: (payload: ImproveBulletPayload) =>
    api.post<ImproveBulletResponse>("/api/ai/improve", payload),

  fixGrammar: (payload: FixGrammarPayload) =>
    api.post<FixGrammarResponse>("/api/ai/grammar", payload),

  suggestAchievements: (payload: SuggestAchievementsPayload) =>
    api.post<SuggestAchievementsResponse>("/api/ai/suggest-achievements", payload),

  generateSummary: (payload: GenerateSummaryPayload) =>
    api.post<GenerateSummaryResponse>("/api/ai/summary", payload),

  generateCoverLetter: (payload: GenerateCoverLetterPayload) =>
    api.post<GenerateCoverLetterResponse>("/api/ai/cover-letter", payload),
};
