import { BriefcaseBusiness, FileText, Save, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useResume } from "@/context/ResumeContext";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { ExperienceForm } from "@/components/resume/ExperienceForm";
import { ProjectsForm } from "@/components/resume/ProjectsForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { CertificationsForm } from "@/components/resume/CertificationsForm";
import { AchievementsForm } from "@/components/resume/AchievementsForm";
import { ResponsibilitiesForm } from "@/components/resume/ResponsibilitiesForm";
import { LanguagesForm } from "@/components/resume/LanguagesForm";
import { InterestsForm } from "@/components/resume/InterestsForm";
import { SectionOrder } from "@/components/resume/SectionOrder";
import { ResumePreview } from "@/components/resume/ResumePreview";
import {
  resumeService,
  type AnalyzeResult,
  type CoverLetterResult,
  type ImproveResult,
  type MatchResult,
  type SummaryResult
} from "@/services/resumeService";
import { useState } from "react";

export function ResumeBuilderPage() {
  const {
    resumeData,
    saveStatus,
    saveResume,
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
    updateSectionOrder
  } = useResume();
  const { user } = useAuth();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("current");
  const [bullet, setBullet] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [improvement, setImprovement] = useState<ImproveResult | null>(null);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toolError, setToolError] = useState("");

  const resumeDataForApi = {
    personalInfo: resumeData.personal,
    experience: resumeData.experience,
    education: resumeData.education,
    skills: resumeData.skills,
    projects: resumeData.projects
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

  function renderSection(key: string) {
    switch (key) {
      case "personal":
        return <PersonalInfoForm data={resumeData.personal} onChange={updatePersonal} />;
      case "education":
        return <EducationForm data={resumeData.education} onChange={updateEducation} />;
      case "experience":
        return <ExperienceForm data={resumeData.experience} onChange={updateExperience} />;
      case "projects":
        return <ProjectsForm data={resumeData.projects} onChange={updateProjects} />;
      case "skills":
        return <SkillsForm data={resumeData.skills} onChange={updateSkills} />;
      case "certifications":
        return <CertificationsForm data={resumeData.certifications} onChange={updateCertifications} />;
      case "achievements":
        return <AchievementsForm data={resumeData.achievements} onChange={updateAchievements} />;
      case "responsibilities":
        return <ResponsibilitiesForm data={resumeData.responsibilities} onChange={updateResponsibilities} />;
      case "languages":
        return <LanguagesForm data={resumeData.languages} onChange={updateLanguages} />;
      case "interests":
        return <InterestsForm data={resumeData.interests} onChange={updateInterests} />;
      default:
        return null;
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] gap-4 p-4 xl:grid-cols-[240px_1fr_420px]">
      {/* Left sidebar - Section order */}
      <aside className="space-y-3">
        <SectionOrder order={resumeData.sectionOrder} onChange={updateSectionOrder} />
        <Card>
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h2 className="font-semibold text-sm">AI Tools</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Analyze and improve your resume.</p>
        </Card>
        <div className="sticky top-4">
          <Button
            className="w-full"
            disabled={saveStatus === "saving"}
            onClick={saveResume}
            type="button"
          >
            <Save size={16} />
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save resume"}
          </Button>
          {saveStatus === "error" && (
            <p className="mt-2 text-xs text-red-600">Save failed. Check Firestore permissions.</p>
          )}
        </div>
      </aside>

      {/* Main form area */}
      <section className="space-y-4">
        {resumeData.sectionOrder.map((key) => (
          <div key={key}>{renderSection(key)}</div>
        ))}

        {/* AI Tools */}
        <Card>
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h2 className="font-semibold">Resume tools</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Analyze a PDF, compare to a job description, and improve your content.</p>
          {toolError && <p className="mt-3 text-sm text-red-600">{toolError}</p>}

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="space-y-3 lg:col-span-2">
              <label className="block text-sm font-medium" htmlFor="resume-pdf">Upload resume PDF</label>
              <div className="rounded-xl border-2 border-dashed border-brutal-ink bg-white p-4 shadow-hard">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-brutal-ink bg-brutal-yellow">
                      <UploadCloud size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold">{resumeFile ? resumeFile.name : "Choose a PDF resume"}</p>
                      <p className="text-xs text-muted-foreground">Posts securely to /api/analyze for ATS scoring.</p>
                    </div>
                  </div>
                  <Input
                    accept="application/pdf"
                    className="max-w-sm bg-background"
                    id="resume-pdf"
                    onChange={(event) => {
                      setResumeFile(event.target.files?.[0] ?? null);
                      setAnalysis(null);
                    }}
                    type="file"
                  />
                </div>
                <Button
                  className="mt-4"
                  disabled={!resumeFile || loadingAction === "analyze"}
                  onClick={() => runTool("analyze", async () => setAnalysis(await resumeService.analyzeResume(resumeFile!)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <FileText size={16} />
                  {loadingAction === "analyze" ? "Analyzing..." : "Analyze ATS"}
                </Button>
              </div>
              {analysis ? <AtsAnalysisReport analysis={analysis} /> : null}
            </div>

            <div className="space-y-3 lg:col-span-2">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={18} />
                <h3 className="font-semibold">Job description match</h3>
              </div>
              <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Select resume</span>
                  <select
                    className="h-11 w-full rounded-xl border-2 border-brutal-ink bg-white px-3 text-sm font-medium text-brutal-ink shadow-hard"
                    onChange={(event) => {
                      setSelectedResumeId(event.target.value);
                      setMatch(null);
                    }}
                    value={selectedResumeId}
                  >
                    <option value="current">
                      {resumeData.personal.name || resumeData.personal.role ? `${resumeData.personal.name || "Current resume"} - ${resumeData.personal.role || "Draft"}` : "Current resume draft"}
                    </option>
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Job description</span>
                  <textarea
                    className="min-h-32 w-full rounded-xl border-2 border-brutal-ink bg-white p-3 text-sm font-medium text-brutal-ink shadow-hard placeholder:text-brutal-line"
                    id="job-description"
                    onChange={(event) => {
                      setJobDescription(event.target.value);
                      setMatch(null);
                    }}
                    placeholder="Paste the target job description"
                    value={jobDescription}
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={!jobDescription.trim() || loadingAction === "match"}
                  onClick={() => runTool("match", async () => setMatch(await resumeService.matchResumeToJob(resumeDataForApi, jobDescription)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {loadingAction === "match" ? "Matching..." : "Compare resume"}
                </Button>
                <Button
                  disabled={!jobDescription.trim() || loadingAction === "cover-letter"}
                  onClick={() => runTool("cover-letter", async () => setCoverLetter(await resumeService.generateCoverLetter(resumeDataForApi, jobDescription)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {loadingAction === "cover-letter" ? "Writing..." : "Cover letter"}
                </Button>
              </div>
              {match ? <JobMatchReport match={match} /> : null}
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
                onClick={() => runTool("improve", async () => setImprovement(await resumeService.improveBullet(bullet, resumeData.personal.summary, resumeData.personal.role)))}
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
                onClick={() => runTool("summary", async () => setSummary(await resumeService.generateSummary(resumeDataForApi)))}
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
      </section>

      {/* Right sidebar - Preview */}
      <aside className="rounded-lg border bg-card p-5 flex flex-col">
        <ResumePreview data={resumeData} />
      </aside>
    </div>
  );
}


function JobMatchReport({ match }: { match: MatchResult }) {
  return (
    <div className="space-y-4 rounded-xl border-2 border-brutal-ink bg-background p-4 shadow-hard">
      <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
        <div className="rounded-xl border-2 border-brutal-ink bg-white p-4 text-center">
          <p className="text-xs font-extrabold uppercase text-muted-foreground">Match percentage</p>
          <p className="mt-2 text-4xl font-extrabold">{match.matchPercentage}%</p>
          <div className="mt-4 h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-brutal-sage" style={{ width: `${Math.min(Math.max(match.matchPercentage, 0), 100)}%` }} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <KeywordList items={match.matchedKeywords} title="Matched keywords" tone="good" />
          <KeywordList items={match.missingKeywords} title="Missing keywords" tone="warn" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ReportList emptyText="No skill gaps found." items={match.skillGaps} title="Skill gaps" />
        <ReportList emptyText="No experience gaps found." items={match.experienceGaps} title="Experience gaps" />
        <ReportList emptyText="No recommendations returned." items={match.recommendations} title="Recommendations" />
      </div>
    </div>
  );
}

function KeywordList({ items, title, tone }: { items: string[]; title: string; tone: "good" | "warn" }) {
  const badgeClass = tone === "good" ? "bg-brutal-sage" : "bg-brutal-yellow";

  return (
    <div className="rounded-xl border-2 border-brutal-ink bg-white p-4">
      <h4 className="text-sm font-extrabold">{title}</h4>
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span className={`${badgeClass} rounded-full border-2 border-brutal-ink px-3 py-1 text-xs font-extrabold`} key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">None returned.</p>
      )}
    </div>
  );
}


function AtsAnalysisReport({ analysis }: { analysis: AnalyzeResult }) {
  const scores = [
    { label: "ATS score", value: analysis.atsScore },
    { label: "Formatting", value: analysis.formattingScore },
    { label: "Content", value: analysis.contentScore },
    { label: "Readability", value: analysis.readabilityScore }
  ];

  return (
    <div className="space-y-4 rounded-xl border-2 border-brutal-ink bg-background p-4 shadow-hard">
      <div>
        <h3 className="text-lg font-semibold">ATS Analysis</h3>
        <p className="mt-1 text-sm text-muted-foreground">Scores and recommendations from your uploaded PDF.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {scores.map((score) => (
          <div className="rounded-xl border-2 border-brutal-ink bg-white p-3" key={score.label}>
            <p className="text-xs font-extrabold uppercase text-muted-foreground">{score.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{score.value}</p>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div className="h-full rounded-full bg-brutal-sage" style={{ width: `${Math.min(Math.max(score.value, 0), 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReportList emptyText="No missing sections detected." items={analysis.missingSections} title="Missing sections" />
        <ReportList emptyText="No suggestions returned." items={analysis.suggestions} title="Suggestions" />
      </div>

      <div>
        <h4 className="text-sm font-extrabold">Extracted text preview</h4>
        <div className="mt-2 max-h-56 overflow-auto rounded-xl border-2 border-brutal-ink bg-white p-3 text-xs leading-5 text-muted-foreground">
          {analysis.extractedText || "No text preview available."}
        </div>
      </div>
    </div>
  );
}

function ReportList({ emptyText, items, title }: { emptyText: string; items: string[]; title: string }) {
  return (
    <div className="rounded-xl border-2 border-brutal-ink bg-white p-4">
      <h4 className="text-sm font-extrabold">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {items.map((item) => (
            <li className="flex gap-2" key={item}>
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brutal-ink" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{emptyText}</p>
      )}
    </div>
  );
}
