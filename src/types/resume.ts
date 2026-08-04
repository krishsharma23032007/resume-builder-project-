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

export type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
};

export type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type SkillEntry = {
  id: string;
  category: string;
  items: string[];
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
};

export type AchievementEntry = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export type ResponsibilityEntry = {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type LanguageEntry = {
  id: string;
  name: string;
  proficiency: "beginner" | "elementary" | "intermediate" | "advanced" | "native";
};

export type InterestEntry = {
  id: string;
  name: string;
};

export type ResumeData = {
  personal: ResumeProfile;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillEntry[];
  certifications: CertificationEntry[];
  achievements: AchievementEntry[];
  responsibilities: ResponsibilityEntry[];
  languages: LanguageEntry[];
  interests: InterestEntry[];
  sectionOrder: ResumeSectionKey[];
};
