import { BriefcaseBusiness, ChevronDown, ChevronRight, FileText, Save, Sparkles, Download } from "lucide-react";
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
import { ResumeImportModal } from "@/components/common/ResumeImportModal";
import {
  resumeService,
  type AnalyzeResult,
  type ImproveResult,
  type MatchResult,
  type ParseResult
} from "@/services/resumeService";
import { useState } from "react";
import { generateId } from "@/utils/generateId";

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
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toolError, setToolError] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

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

  function handleImportResume(data: ParseResult) {
    // Import personal info
    updatePersonal({
      name: data.personal.name,
      role: data.personal.role,
      location: data.personal.location,
      email: data.personal.email,
      phone: data.personal.phone,
      summary: data.personal.summary
    });

    // Import education
    updateEducation(data.education.map(edu => ({
      id: generateId(),
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa
    })));

    // Import experience
    updateExperience(data.experience.map(exp => ({
      id: generateId(),
      company: exp.company,
      title: exp.title,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      bullets: exp.bullets
    })));

    // Import projects
    updateProjects(data.projects.map(proj => ({
      id: generateId(),
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies,
      link: proj.link,
      startDate: proj.startDate,
      endDate: proj.endDate,
      bullets: proj.bullets || []
    })));

    // Import skills
    updateSkills(data.skills.map(skill => ({
      id: generateId(),
      category: skill.category,
      items: skill.items
    })));

    // Import certifications
    updateCertifications(data.certifications.map(cert => ({
      id: generateId(),
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      link: cert.link
    })));

    // Import achievements
    updateAchievements(data.achievements.map(ach => ({
      id: generateId(),
      title: ach.title,
      description: ach.description,
      date: ach.date
    })));

    // Import languages
    updateLanguages(data.languages.map(lang => ({
      id: generateId(),
      name: lang.name,
      proficiency: lang.proficiency as "beginner" | "elementary" | "intermediate" | "advanced" | "native"
    })));

    // Import interests
    updateInterests(data.interests.map(interest => ({
      id: generateId(),
      name: interest.name
    })));
  }

  function renderSection(key: string) {
    switch (key) {
      case "personal":
        return <PersonalInfoForm data={resumeData.personal} onChange={updatePersonal} resumeData={resumeDataForApi} />;
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
    <div className="grid min-h-[calc(100vh-4rem)] gap-4 p-4 xl:grid-cols-[260px_1fr_420px]">
      {/* Left sidebar - Section order + Resume tools */}
      <aside className="space-y-3 overflow-y-auto max-h-[calc(100vh-6rem)]">
        <SectionOrder order={resumeData.sectionOrder} onChange={updateSectionOrder} />

        {/* Resume Tools */}
        <Card>
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h2 className="font-semibold text-sm">Resume Tools</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Analyze, compare, and improve.</p>
          {toolError && <p className="mt-2 text-xs text-red-600">{toolError}</p>}

          <div className="mt-3 space-y-2">
            {/* ATS Analysis */}
            <button
              className="flex w-full items-center justify-between rounded-lg border bg-background p-2.5 text-left text-sm font-medium hover:bg-muted"
              onClick={() => setExpandedTool(expandedTool === "ats" ? null : "ats")}
              type="button"
            >
              <span className="flex items-center gap-2">
                <FileText size={16} />
                ATS Analysis
              </span>
              {expandedTool === "ats" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedTool === "ats" && (
              <div className="space-y-2 rounded-lg border bg-background p-3">
                <label className="block text-xs font-medium" htmlFor="resume-pdf">Upload PDF</label>
                <Input
                  accept="application/pdf"
                  className="w-full text-xs"
                  id="resume-pdf"
                  onChange={(event) => {
                    setResumeFile(event.target.files?.[0] ?? null);
                    setAnalysis(null);
                  }}
                  type="file"
                />
                {resumeFile && <p className="truncate text-xs text-muted-foreground">{resumeFile.name}</p>}
                <Button
                  className="w-full"
                  disabled={!resumeFile || loadingAction === "analyze"}
                  onClick={() => runTool("analyze", async () => setAnalysis(await resumeService.analyzeResume(resumeFile!)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {loadingAction === "analyze" ? "Analyzing..." : "Analyze ATS"}
                </Button>
                {analysis && (
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <ScoreBadge label="ATS" value={analysis.atsScore} />
                      <ScoreBadge label="Format" value={analysis.formattingScore} />
                      <ScoreBadge label="Content" value={analysis.contentScore} />
                      <ScoreBadge label="Read" value={analysis.readabilityScore} />
                    </div>
                    {analysis.suggestions.length > 0 && (
                      <p className="text-muted-foreground">{analysis.suggestions[0]}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Job Match */}
            <button
              className="flex w-full items-center justify-between rounded-lg border bg-background p-2.5 text-left text-sm font-medium hover:bg-muted"
              onClick={() => setExpandedTool(expandedTool === "match" ? null : "match")}
              type="button"
            >
              <span className="flex items-center gap-2">
                <BriefcaseBusiness size={16} />
                Job Match
              </span>
              {expandedTool === "match" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedTool === "match" && (
              <div className="space-y-2 rounded-lg border bg-background p-3">
                <label className="block space-y-1">
                  <span className="text-xs font-medium">Select resume</span>
                  <select
                    className="h-8 w-full rounded-lg border bg-white px-2 text-xs"
                    onChange={(event) => {
                      setSelectedResumeId(event.target.value);
                      setMatch(null);
                    }}
                    value={selectedResumeId}
                  >
                    <option value="current">
                      {resumeData.personal.name || resumeData.personal.role ? `${resumeData.personal.name || "Current"} - ${resumeData.personal.role || "Draft"}` : "Current draft"}
                    </option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-medium">Job description</span>
                  <textarea
                    className="min-h-20 w-full rounded-lg border bg-white p-2 text-xs"
                    onChange={(event) => {
                      setJobDescription(event.target.value);
                      setMatch(null);
                    }}
                    placeholder="Paste job description..."
                    value={jobDescription}
                  />
                </label>
                <Button
                  className="w-full"
                  disabled={!jobDescription.trim() || loadingAction === "match"}
                  onClick={() => runTool("match", async () => setMatch(await resumeService.matchResumeToJob(resumeDataForApi, jobDescription)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {loadingAction === "match" ? "Matching..." : "Compare"}
                </Button>
                {match && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-lg">{match.matchPercentage}%</span>
                      <span className="text-muted-foreground">match</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-brutal-sage" style={{ width: `${Math.min(Math.max(match.matchPercentage, 0), 100)}%` }} />
                    </div>
                    {match.missingKeywords.length > 0 && (
                      <p className="text-muted-foreground">Missing: {match.missingKeywords.slice(0, 3).join(", ")}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bullet Improvement */}
            <button
              className="flex w-full items-center justify-between rounded-lg border bg-background p-2.5 text-left text-sm font-medium hover:bg-muted"
              onClick={() => setExpandedTool(expandedTool === "bullet" ? null : "bullet")}
              type="button"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} />
                Improve Bullet
              </span>
              {expandedTool === "bullet" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedTool === "bullet" && (
              <div className="space-y-2 rounded-lg border bg-background p-3">
                <label className="block space-y-1">
                  <span className="text-xs font-medium">Experience bullet</span>
                  <textarea
                    className="min-h-16 w-full rounded-lg border bg-white p-2 text-xs"
                    onChange={(event) => setBullet(event.target.value)}
                    placeholder="Built a dashboard for internal users"
                    value={bullet}
                  />
                </label>
                <Button
                  className="w-full"
                  disabled={!bullet.trim() || loadingAction === "improve"}
                  onClick={() => runTool("improve", async () => setImprovement(await resumeService.improveBullet(bullet, resumeData.personal.summary, resumeData.personal.role)))}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {loadingAction === "improve" ? "Improving..." : "Improve"}
                </Button>
                {improvement && (
                  <div className="rounded-lg border bg-white p-2 text-xs">
                    <p>{improvement.improved}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Action buttons */}
        <div className="sticky bottom-0 space-y-2 bg-card pb-2 pt-2">
          <Button
            className="w-full"
            onClick={() => setShowImportModal(true)}
            size="sm"
            type="button"
            variant="outline"
          >
            <Download size={16} />
            Import Resume
          </Button>
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
      </section>

      {/* Right sidebar - Preview */}
      <aside className="rounded-lg border bg-card p-5 flex flex-col">
        <ResumePreview data={resumeData} />
      </aside>

      {/* Import Modal */}
      {showImportModal && (
        <ResumeImportModal
          onImport={handleImportResume}
          onClose={() => setShowImportModal(false)}
        />
      )}
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

function ScoreBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-white p-2 text-center">
      <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-extrabold">{value}</p>
      <div className="mt-1 h-1 rounded-full bg-muted">
        <div className="h-full rounded-full bg-brutal-sage" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
    </div>
  );
}
