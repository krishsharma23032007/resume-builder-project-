import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useResume } from "@/context/ResumeContext";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { resumeService, type CoverLetterResult } from "@/services/resumeService";
import { FileText, Loader2, Sparkles } from "lucide-react";

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "concise", label: "Concise" }
] as const;

export function CoverLetterPage() {
  const { resumeData } = useResume();
  const { user } = useAuth();

  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [tone, setTone] = useState<"formal" | "enthusiastic" | "concise">("formal");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resumeDataForApi = {
    personalInfo: resumeData.personal,
    experience: resumeData.experience,
    education: resumeData.education,
    skills: resumeData.skills,
    projects: resumeData.projects,
    certifications: resumeData.certifications,
    achievements: resumeData.achievements,
    responsibilities: resumeData.responsibilities,
    languages: resumeData.languages,
    interests: resumeData.interests
  };

  async function handleGenerate() {
    if (!user) {
      setError("Log in to use AI cover letter generator.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await resumeService.generateCoverLetter(
        resumeDataForApi,
        jobDescription,
        tone,
        company || undefined,
        jobTitle || undefined
      );
      setCoverLetter(result.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] gap-4 p-4 xl:grid-cols-[1fr_420px]">
      {/* Main content */}
      <section className="space-y-4">
        <Card>
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <h1 className="text-lg font-semibold">Cover Letter Generator</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate a tailored cover letter for any job application.
          </p>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium">Company name</span>
                <Input
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Acme Corp"
                  value={company}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Job title</span>
                <Input
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Job description *</span>
              <textarea
                className="min-h-40 w-full rounded-xl border-2 border-brutal-ink bg-white p-3 text-sm font-medium text-brutal-ink shadow-hard placeholder:text-brutal-line"
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                value={jobDescription}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium">Tone</span>
              <div className="flex gap-2">
                {TONES.map((t) => (
                  <Button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    size="sm"
                    type="button"
                    variant={tone === t.value ? "primary" : "outline"}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              disabled={!jobDescription.trim() || loading}
              onClick={handleGenerate}
              type="button"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {loading ? "Generating..." : "Generate Cover Letter"}
            </Button>
          </div>
        </Card>

        {coverLetter && (
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Generated Cover Letter</h2>
              <span className="rounded-full border-2 border-brutal-ink bg-brutal-sage px-3 py-1 text-xs font-extrabold">
                {tone}
              </span>
            </div>
            <textarea
              className="mt-4 min-h-72 w-full rounded-xl border-2 border-brutal-ink bg-white p-4 text-sm font-medium leading-relaxed text-brutal-ink shadow-hard placeholder:text-brutal-line"
              onChange={(e) => setCoverLetter(e.target.value)}
              value={coverLetter}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Edit the cover letter above before copying or downloading.
            </p>
          </Card>
        )}
      </section>

      {/* Right sidebar - Resume preview */}
      <aside className="rounded-lg border bg-card p-5 flex flex-col">
        <h3 className="mb-3 text-sm font-semibold">Your Resume</h3>
        <ResumePreview data={resumeData} />
      </aside>
    </div>
  );
}
