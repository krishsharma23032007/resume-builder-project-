import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp
} from "firebase/firestore";
import { resumeProfile } from "@/data/mockResumes";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import type { ResumeProfile, ResumeSummary } from "@/types/resume";

type ResumeContextValue = {
  profile: ResumeProfile;
  resumes: ResumeSummary[];
  isLoading: boolean;
  error: string;
  createResume: () => Promise<string>;
  duplicateResume: (resume: ResumeSummary) => Promise<string>;
  deleteResume: (resumeId: string) => Promise<void>;
  updateProfile: (profile: ResumeProfile) => void;
};

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const [profile, setProfile] = useState(resumeProfile);
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading" || status === "submitting") {
      setIsLoading(true);
      return;
    }

    if (!user) {
      setResumes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    const resumesQuery = query(getUserResumesCollection(user.id), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(
      resumesQuery,
      (snapshot) => {
        setResumes(snapshot.docs.map(toResumeSummary));
        setIsLoading(false);
      },
      (snapshotError) => {
        console.error("Resume subscription failed:", snapshotError);
        setError("Could not load resumes. Check Firestore permissions and try again.");
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [status, user]);

  async function createResume() {
    if (!user) {
      throw new Error("Log in to create a resume.");
    }

    const created = await addDoc(getUserResumesCollection(user.id), {
      title: "Untitled Resume",
      role: "Target role",
      atsScore: 0,
      template: "Modern",
      ownerId: user.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return created.id;
  }

  async function duplicateResume(resume: ResumeSummary) {
    if (!user) {
      throw new Error("Log in to duplicate a resume.");
    }

    const duplicate = await addDoc(getUserResumesCollection(user.id), {
      title: `${resume.title} Copy`,
      role: resume.role,
      atsScore: resume.atsScore,
      template: resume.template,
      ownerId: user.id,
      sourceResumeId: resume.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return duplicate.id;
  }

  async function deleteResume(resumeId: string) {
    if (!user) {
      throw new Error("Log in to delete a resume.");
    }

    await deleteDoc(doc(db, "users", user.id, "resumes", resumeId));
  }

  const value = useMemo(
    () => ({
      profile,
      resumes,
      isLoading,
      error,
      createResume,
      duplicateResume,
      deleteResume,
      updateProfile: setProfile
    }),
    [error, isLoading, profile, resumes, user]
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

function getUserResumesCollection(userId: string) {
  return collection(db, "users", userId, "resumes");
}

function toResumeSummary(document: QueryDocumentSnapshot<DocumentData>): ResumeSummary {
  const data = document.data();

  return {
    id: document.id,
    title: typeof data.title === "string" && data.title.trim() ? data.title : "Untitled Resume",
    role: typeof data.role === "string" && data.role.trim() ? data.role : "Target role",
    atsScore: typeof data.atsScore === "number" ? data.atsScore : 0,
    template: typeof data.template === "string" && data.template.trim() ? data.template : "Modern",
    updatedAt: formatUpdatedAt(data.updatedAt)
  };
}

function formatUpdatedAt(value: unknown) {
  if (isTimestamp(value)) {
    return value.toDate().toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "Just now";
}

function isTimestamp(value: unknown): value is Timestamp {
  return Boolean(value && typeof value === "object" && "toDate" in value);
}
