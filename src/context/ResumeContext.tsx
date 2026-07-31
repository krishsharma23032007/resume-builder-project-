import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type {
  AchievementEntry,
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  InterestEntry,
  LanguageEntry,
  ProjectEntry,
  ResponsibilityEntry,
  ResumeData,
  ResumeSectionKey,
  SkillEntry
} from "@/types/resume";

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

type ResumeContextValue = {
  resumeData: ResumeData;
  saveStatus: "idle" | "saving" | "saved" | "error";
  updatePersonal: (data: ResumeData["personal"]) => void;
  updateEducation: (data: EducationEntry[]) => void;
  updateExperience: (data: ExperienceEntry[]) => void;
  updateProjects: (data: ProjectEntry[]) => void;
  updateSkills: (data: SkillEntry[]) => void;
  updateCertifications: (data: CertificationEntry[]) => void;
  updateAchievements: (data: AchievementEntry[]) => void;
  updateResponsibilities: (data: ResponsibilityEntry[]) => void;
  updateLanguages: (data: LanguageEntry[]) => void;
  updateInterests: (data: InterestEntry[]) => void;
  updateSectionOrder: (order: ResumeSectionKey[]) => void;
  saveResume: () => Promise<void>;
};

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDataRef = useRef(resumeData);

  latestDataRef.current = resumeData;

  useEffect(() => {
    if (!user) {
      setResumeData(defaultResumeData);
      return;
    }

    const resumeRef = doc(db, "resumes", user.id);
    const unsubscribe = onSnapshot(
      resumeRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setResumeData({ ...defaultResumeData, ...snapshot.data() } as ResumeData);
        }
      },
      (error) => {
        console.error("Resume subscription error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const saveResume = useCallback(async () => {
    if (!user) return;
    setSaveStatus("saving");
    try {
      const resumeRef = doc(db, "resumes", user.id);
      await setDoc(resumeRef, latestDataRef.current, { merge: true });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("error");
    }
  }, [user]);

  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveResume();
    }, 2000);
  }, [saveResume]);

  const updatePersonal = useCallback(
    (data: ResumeData["personal"]) => {
      setResumeData((prev) => ({ ...prev, personal: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateEducation = useCallback(
    (data: EducationEntry[]) => {
      setResumeData((prev) => ({ ...prev, education: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateExperience = useCallback(
    (data: ExperienceEntry[]) => {
      setResumeData((prev) => ({ ...prev, experience: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateProjects = useCallback(
    (data: ProjectEntry[]) => {
      setResumeData((prev) => ({ ...prev, projects: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateSkills = useCallback(
    (data: SkillEntry[]) => {
      setResumeData((prev) => ({ ...prev, skills: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateCertifications = useCallback(
    (data: CertificationEntry[]) => {
      setResumeData((prev) => ({ ...prev, certifications: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateAchievements = useCallback(
    (data: AchievementEntry[]) => {
      setResumeData((prev) => ({ ...prev, achievements: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateResponsibilities = useCallback(
    (data: ResponsibilityEntry[]) => {
      setResumeData((prev) => ({ ...prev, responsibilities: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateLanguages = useCallback(
    (data: LanguageEntry[]) => {
      setResumeData((prev) => ({ ...prev, languages: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateInterests = useCallback(
    (data: InterestEntry[]) => {
      setResumeData((prev) => ({ ...prev, interests: data }));
      autoSave();
    },
    [autoSave]
  );

  const updateSectionOrder = useCallback(
    (order: ResumeSectionKey[]) => {
      setResumeData((prev) => ({ ...prev, sectionOrder: order }));
      autoSave();
    },
    [autoSave]
  );

  const value = useMemo(
    () => ({
      resumeData,
      saveStatus,
      updatePersonal,
      updateEducation,
      updateExperience,
      updateProjects,
      updateSkills,
      updateCertifications,
      updateAchievements,
      updateResponsibilities,
      updateLanguages,
      updateInterests,
      updateSectionOrder,
      saveResume
    }),
    [
      resumeData,
      saveStatus,
      updatePersonal,
      updateEducation,
      updateExperience,
      updateProjects,
      updateSkills,
      updateCertifications,
      updateAchievements,
      updateResponsibilities,
      updateLanguages,
      updateInterests,
      updateSectionOrder,
      saveResume
    ]
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
