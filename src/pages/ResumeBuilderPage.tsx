import { useState } from "react";
import { FileText, GripVertical, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useResume } from "@/context/ResumeContext";
import {
  resumeService,
  type AnalyzeResult,
  type CoverLetterResult,
  type ImproveResult,
  type MatchResult,
  type SummaryResult
} from "@/services/resumeService";

const sections = ["Personal", "Education", "Experience", "Projects", "Skills", "Certifications"];

export function ResumeBuilderPage() {
  const { profile } = useResume();
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [bullet, setBullet] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [improvement, setImprovement] = useState<ImproveResult | null>(null);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toolError, setToolError] = useState("");

  const resumeData = {
    personalInfo: profile,
    experience: [],
    education: [],
    skills: [],
    projects: []
  };

  async function runTool(action: string, task: () => Promise<void>) {
    if (!user) {
      setToolError("Log in to use resume analysis and AI tools.");
      return;
    }

    setToolError("");
    setLoadingAction(action);
    try {
      await task();
    } catch (error) {
      setToolError(error instanceof Error ? error.message : "Request failed. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] gap-4 p-4 xl:grid-cols-[240px_1fr_420px]">
      <aside className="rounded-lg border bg-card p-3">
        {sections.map((section) => (
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted" key={section}>
            <GripVertical size={15} />
            {section}
          </button>
        ))}
      </aside>
      <section className="space-y-4">
        <Card>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Personal information</h1>
            <Button size="sm" variant="outline">
              <Plus size={16} />
              Add
            </Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input defaultValue={profile.name} aria-label="Name" />
            <Input defaultValue={profile.role} aria-label="Role" />
            <Input defaultValue={profile.email} aria-label="Email" />
            <Input defaultValue={profile.location} aria-label="Location" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h2 className="font-semibold">Resume tools</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Analyze a PDF, compare it to a job description, and improve your content.</p>
          {toolError && <p className="mt-3 text-sm text-red-600">{toolError}</p>}

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium" htmlFor="resume-pdf">Resume PDF</label>
              <input
                accept="application/pdf"
                className="block w-full text-sm"
                id="resume-pdf"
                onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                type="file"
              />
              <Button
                disabled={!resumeFile || loadingAction === "analyze"}
                onClick={() => runTool("analyze", async () => setAnalysis(await resumeService.analyzeResume(resumeFile!)))}
                size="sm"
                type="button"
                variant="outline"
              >
                <FileText size={16} />
                {loadingAction === "analyze" ? "Analyzing..." : "Analyze resume"}
              </Button>
              {analysis && (
                <p className="text-sm">ATS {analysis.atsScore}/100. {analysis.suggestions[0] || "No high-priority suggestions."}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium" htmlFor="job-description">Job description</label>
              <textarea
                className="min-h-24 w-full rounded-lg border bg-background p-3 text-sm"
                id="job-description"
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the target job description"
                value={jobDescription}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={!jobDescription.trim() || loadingAction === "match"}
                  onClick={() => runTool("match", async () => setMatch(await resumeService.matchResumeToJob(resumeData, jobDescription)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {loadingAction === "match" ? "Matching..." : "Match job"}
                </Button>
                <Button
                  disabled={!jobDescription.trim() || loadingAction === "cover-letter"}
                  onClick={() => runTool("cover-letter", async () => setCoverLetter(await resumeService.generateCoverLetter(resumeData, jobDescription)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {loadingAction === "cover-letter" ? "Writing..." : "Cover letter"}
                </Button>
              </div>
              {match && <p className="text-sm">Job match: {match.matchPercentage}%. Missing: {match.missingKeywords.join(", ") || "none"}.</p>}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium" htmlFor="resume-bullet">Experience bullet</label>
              <textarea
                className="min-h-20 w-full rounded-lg border bg-background p-3 text-sm"
                id="resume-bullet"
                onChange={(event) => setBullet(event.target.value)}
                placeholder="Built a dashboard for internal users"
                value={bullet}
              />
              <Button
                disabled={!bullet.trim() || loadingAction === "improve"}
                onClick={() => runTool("improve", async () => setImprovement(await resumeService.improveBullet(bullet, profile.summary, profile.role)))}
                size="sm"
                type="button"
                variant="outline"
              >
                {loadingAction === "improve" ? "Improving..." : "Improve bullet"}
              </Button>
              {improvement && <p className="text-sm">{improvement.improved}</p>}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Profile summary</p>
              <Button
                disabled={loadingAction === "summary"}
                onClick={() => runTool("summary", async () => setSummary(await resumeService.generateSummary(resumeData)))}
                size="sm"
                type="button"
                variant="outline"
              >
                {loadingAction === "summary" ? "Writing..." : "Generate summary"}
              </Button>
              {summary && <p className="text-sm">{summary.summary}</p>}
              {coverLetter && <p className="text-sm whitespace-pre-line">{coverLetter.coverLetter}</p>}
            </div>
          </div>
        </Card>
        {sections.slice(1).map((section) => (
          <Card className="shadow-none" key={section}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{section}</h2>
              <Button size="sm" variant="ghost">
                <Plus size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </section>
      <aside className="rounded-lg border bg-card p-5">
        <div className="mx-auto aspect-[210/297] max-w-sm bg-background p-6 shadow-soft">
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-primary">{profile.role}</p>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">{profile.summary}</p>
          <div className="mt-6 space-y-3">
            <div className="h-3 rounded bg-muted" />
            <div className="h-3 w-5/6 rounded bg-muted" />
            <div className="h-16 rounded bg-muted" />
          </div>
        </div>
      </aside>
    </div>
  );
}
