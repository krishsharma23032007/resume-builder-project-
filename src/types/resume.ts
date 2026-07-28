export type ResumeSectionKey =
  | "personal"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications"
  | "achievements"
  | "languages"
  | "interests"
  | "responsibilities";

export type ResumeSummary = {
  id: string;
  title: string;
  role: string;
  atsScore: number;
  updatedAt: string;
  template: string;
};

export type ResumeProfile = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
};
