import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, Filter, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ResumeCard } from "@/features/resume/ResumeCard";
import { useResume } from "@/context/ResumeContext";
import type { ResumeSummary } from "@/types/resume";

export function ResumeLibraryPage() {
  const navigate = useNavigate();
  const { deleteResume, duplicateResume, error, isLoading, resumes } = useResume();
  const [query, setQuery] = useState("");
  const [busyResumeId, setBusyResumeId] = useState<string | null>(null);

  const filteredResumes = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) {
      return resumes;
    }

    return resumes.filter((resume) =>
      [resume.title, resume.role, resume.template].some((value) => value.toLowerCase().includes(searchTerm))
    );
  }, [query, resumes]);

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
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Resume library</h1>
          <p className="mt-2 text-muted-foreground">Search, sort, and compare active versions.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={17} />
            <Input
              className="pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resumes"
              value={query}
            />
          </div>
          <Button variant="outline">
            <Filter size={17} />
            Filter
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="mt-8 border-red-500 bg-red-50 text-red-700 shadow-none">
          <p className="font-semibold">{error}</p>
        </Card>
      ) : null}

      {isLoading ? (
        <div className="mt-8 grid min-h-64 place-items-center text-muted-foreground">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : null}

      {!isLoading && filteredResumes.length === 0 ? (
        <Card className="mt-8 grid min-h-64 place-items-center text-center shadow-none">
          <div>
            <FileText className="mx-auto text-muted-foreground" size={32} />
            <h2 className="mt-4 text-xl font-semibold">No resumes found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {resumes.length === 0 ? "Create your first resume from the dashboard." : "Try a different search term."}
            </p>
          </div>
        </Card>
      ) : null}

      {!isLoading && filteredResumes.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredResumes.map((resume) => (
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
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
