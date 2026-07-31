import { Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
                {loadingAction === "analyze" ? "Analyzing..." : "Analyze resume"}
              </Button>
              {analysis && (
                <p className="text-sm">ATS {analysis.atsScore}/100. {analysis.suggestions[0] || "No suggestions."}</p>
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
                  onClick={() => runTool("match", async () => setMatch(await resumeService.matchResumeToJob(resumeDataForApi, jobDescription)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {loadingAction === "match" ? "Matching..." : "Match job"}
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
