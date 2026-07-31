import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, Gauge, Loader2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/features/dashboard/MetricCard";
import { ResumeCard } from "@/features/resume/ResumeCard";
import { useResume } from "@/context/ResumeContext";
import type { ResumeSummary } from "@/types/resume";

export function DashboardPage() {
  const navigate = useNavigate();
  const { createResume, deleteResume, duplicateResume, error, isLoading, resumes } = useResume();
  const [busyResumeId, setBusyResumeId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const topScore = resumes.reduce((score, resume) => Math.max(score, resume.atsScore), 0);

  async function handleCreateResume() {
    setIsCreating(true);
    try {
      const resumeId = await createResume();
      toast.success("Resume created.");
      navigate(`/resume/${resumeId}`);
    } catch (createError) {
      toast.error(getErrorMessage(createError, "Could not create resume."));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDuplicateResume(resume: ResumeSummary) {
    setBusyResumeId(resume.id);
    try {
      const duplicateId = await duplicateResume(resume);
      toast.success("Resume duplicated.");
      navigate(`/resume/${duplicateId}`);
    } catch (duplicateError) {
      toast.error(getErrorMessage(duplicateError, "Could not duplicate resume."));
    } finally {
      setBusyResumeId(null);
    }
  }

  async function handleDeleteResume(resume: ResumeSummary) {
    const confirmed = window.confirm(`Delete "${resume.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setBusyResumeId(resume.id);
    try {
      await deleteResume(resume.id);
      toast.success("Resume deleted.");
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "Could not delete resume."));
    } finally {
      setBusyResumeId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Create, manage, and improve every resume version.</p>
        </div>
        <Button disabled={isCreating} onClick={handleCreateResume} type="button">
          {isCreating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Create Resume
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard detail="Saved to your account" icon={FileText} label="Resumes" value={String(resumes.length)} />
        <MetricCard detail="Best active version" icon={Gauge} label="Top ATS score" value={String(topScore)} />
        <MetricCard detail="Available in resume tools" icon={Sparkles} label="AI rewrites" value="Ready" />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your resumes</h2>
          {isLoading ? <span className="text-sm text-muted-foreground">Loading...</span> : null}
        </div>

        {error ? (
          <Card className="border-red-500 bg-red-50 text-red-700 shadow-none">
            <p className="font-semibold">{error}</p>
          </Card>
        ) : null}

        {isLoading ? <ResumeLoadingGrid /> : null}

        {!isLoading && !error && resumes.length === 0 ? (
          <Card className="grid min-h-72 place-items-center text-center shadow-none">
            <div className="max-w-md">
              <div className="mx-auto grid size-14 place-items-center rounded-xl border-2 border-brutal-ink bg-brutal-yellow shadow-hard">
                <FileText size={24} />
              </div>
              <h2 className="mt-5 text-xl font-semibold">No resumes yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Start your first resume and it will be saved to your Firebase account automatically.
              </p>
              <Button className="mt-5" disabled={isCreating} onClick={handleCreateResume} type="button">
                {isCreating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                Create Resume
              </Button>
            </div>
          </Card>
        ) : null}

        {!isLoading && resumes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard
                isBusy={busyResumeId === resume.id}
                key={resume.id}
                onDelete={handleDeleteResume}
                onDuplicate={handleDuplicateResume}
                resume={resume}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function ResumeLoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card className="space-y-5 shadow-none" key={index}>
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
