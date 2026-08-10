import { useSearchParams } from "react-router-dom";
import { ResumePreview } from "@/components/resume/ResumePreview";
import type { ResumeData } from "@/types/resume";

const defaultResumeData: ResumeData = {
  personal: {
    name: "",
    role: "",
    location: "",
    email: "",
    phone: "",
    summary: ""
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  responsibilities: [],
  languages: [],
  interests: [],
  sectionOrder: [
    "personal",
    "education",
    "experience",
    "projects",
    "skills",
    "certifications",
    "achievements",
    "responsibilities",
    "languages",
    "interests"
  ]
};

export function SharedResumePage() {
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get("data");

  let resumeData: ResumeData = defaultResumeData;
  let hasError = false;

  if (dataParam) {
    try {
      const decoded = JSON.parse(atob(dataParam));
      resumeData = { ...defaultResumeData, ...decoded };
    } catch {
      hasError = true;
    }
  } else {
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-brutal-yellow flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brutal-ink mb-2">Invalid or Expired Link</h1>
          <p className="text-muted-foreground">This resume link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-yellow">
      <div className="mx-auto max-w-4xl p-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-brutal-ink">Resume</h1>
          <p className="text-sm text-muted-foreground">Shared via ResumeGuru</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-soft">
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </div>
  );
}
