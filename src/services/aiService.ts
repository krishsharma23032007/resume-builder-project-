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
  resumeContent: string;
}

interface GenerateSummaryResponse {
  summary: string;
}

interface GenerateCoverLetterPayload {
  jobDescription: string;
  resumeContent: string;
}

interface GenerateCoverLetterResponse {
  coverLetter: string;
}

export const aiService = {
  improveBullet: (payload: ImproveBulletPayload) =>
    api.post<ImproveBulletResponse>("/ai/improve", payload),

  fixGrammar: (payload: FixGrammarPayload) =>
    api.post<FixGrammarResponse>("/ai/grammar", payload),

  suggestAchievements: (payload: SuggestAchievementsPayload) =>
    api.post<SuggestAchievementsResponse>("/ai/suggest-achievements", payload),

  generateSummary: (payload: GenerateSummaryPayload) =>
    api.post<GenerateSummaryResponse>("/ai/summary", payload),

  generateCoverLetter: (payload: GenerateCoverLetterPayload) =>
    api.post<GenerateCoverLetterResponse>("/ai/cover-letter", payload),
};
