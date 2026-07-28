import type { ResumeProfile, ResumeSummary } from "@/types/resume";

export const resumeProfile: ResumeProfile = {
  name: "Avery Morgan",
  role: "Senior Product Designer",
  location: "San Francisco, CA",
  email: "avery@resumeguru.in",
  phone: "+1 (415) 555-0198",
  summary:
    "Design leader with a track record of shipping AI-assisted workflow products from zero to one."
};

export const resumes: ResumeSummary[] = [
  {
    id: "res-01",
    title: "Product Design Lead",
    role: "Design Systems, AI Tools",
    atsScore: 92,
    updatedAt: "Today",
    template: "Executive"
  },
  {
    id: "res-02",
    title: "Founding Designer",
    role: "SaaS, Growth",
    atsScore: 86,
    updatedAt: "Yesterday",
    template: "Modern"
  },
  {
    id: "res-03",
    title: "UX Manager",
    role: "Research, Strategy",
    atsScore: 78,
    updatedAt: "Jul 18",
    template: "Classic"
  }
];
