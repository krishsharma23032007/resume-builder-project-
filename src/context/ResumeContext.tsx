import { createContext, useContext, useMemo, useState } from "react";
import { resumeProfile, resumes } from "@/data/mockResumes";
import type { ResumeProfile, ResumeSummary } from "@/types/resume";

type ResumeContextValue = {
  profile: ResumeProfile;
  resumes: ResumeSummary[];
  updateProfile: (profile: ResumeProfile) => void;
};

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState(resumeProfile);

  const value = useMemo(
    () => ({
      profile,
      resumes,
      updateProfile: setProfile
    }),
    [profile]
  );

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used inside ResumeProvider");
  }
  return context;
}
