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
    <div className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">
      {/* Mobile: Top action bar */}
      <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
        <Button
          onClick={() => setShowImportModal(true)}
          size="sm"
          type="button"
          variant="outline"
        >
          <Download size={16} />
          Import
        </Button>
        <Button
          disabled={saveStatus === "saving"}
          onClick={saveResume}
          size="sm"
          type="button"
        >
          <Save size={16} />
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save"}
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[240px_1fr_420px]">
        {/* Left sidebar - Section order (hidden on mobile, shown on desktop) */}
        <aside className="hidden space-y-3 lg:block">
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
          {/* Mobile: Section order */}
          <div className="lg:hidden">
            <SectionOrder order={resumeData.sectionOrder} onChange={updateSectionOrder} />
          </div>

          {resumeData.sectionOrder.map((key) => (
            <div key={key}>{renderSection(key)}</div>
          ))}
        </section>

        {/* Right sidebar - Preview */}
        <aside className="rounded-lg border bg-card p-5 flex flex-col">
          <ResumePreview data={resumeData} />
        </aside>
      </div>

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
