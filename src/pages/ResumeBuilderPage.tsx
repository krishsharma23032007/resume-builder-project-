import { Save, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
import { type ParseResult } from "@/services/resumeService";
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

  const [showImportModal, setShowImportModal] = useState(false);

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
    <div className="grid min-h-[calc(100vh-4rem)] gap-4 p-4 xl:grid-cols-[240px_1fr_420px]">
      {/* Left sidebar - Section order */}
      <aside className="space-y-3">
        <SectionOrder order={resumeData.sectionOrder} onChange={updateSectionOrder} />
        <div className="sticky top-4 space-y-2">
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
