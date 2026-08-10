import { useState } from "react";
import { Download, FileText, Share2 } from "lucide-react";
import type { ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";
import { ResumePdfExport } from "@/components/resume/ResumePdfExport";
import { ResumeDocxExport } from "@/components/resume/ResumeDocxExport";
import { ShareableLink } from "@/components/resume/ShareableLink";
import { Button } from "@/components/ui/Button";

type ResumePreviewProps = {
  data: ResumeData;
};

type Template = "classic" | "modern" | "compact" | "executive" | "minimal" | "creative" | "technical" | "gradient" | "sidebar" | "timeline" | "magazine" | "corporate" | "bold";

const templateOptions: { value: Template; label: string }[] = [
  { value: "classic", label: "Classic" },
  { value: "modern", label: "Modern" },
  { value: "compact", label: "Compact" },
  { value: "executive", label: "Executive" },
  { value: "minimal", label: "Minimal" },
  { value: "creative", label: "Creative" },
  { value: "technical", label: "Technical" },
  { value: "gradient", label: "Gradient" },
  { value: "sidebar", label: "Sidebar" },
  { value: "timeline", label: "Timeline" },
  { value: "magazine", label: "Magazine" },
  { value: "corporate", label: "Corporate" },
  { value: "bold", label: "Bold" }
];

export function ResumePreview({ data }: ResumePreviewProps) {
  const [template, setTemplate] = useState<Template>("classic");

  return (
    <div className="flex flex-col h-full">
      {/* Template selector and Export */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">Template:</span>
          {templateOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTemplate(opt.value)}
              className={cn(
                "rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors sm:px-3 sm:text-xs",
                template === opt.value
                  ? "bg-brutal-ink text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <ResumePdfExport
            data={data}
            template={template}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brutal-ink text-white px-2 py-1 text-[10px] font-semibold hover:bg-brutal-ink/90 transition-colors no-underline sm:px-3 sm:py-1.5 sm:text-xs"
          />
          <ResumeDocxExport
            data={data}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-brutal-ink bg-white text-brutal-ink px-2 py-1 text-[10px] font-semibold hover:bg-brutal-sage transition-colors no-underline sm:px-3 sm:py-1.5 sm:text-xs"
          />
          <ShareableLink
            data={data}
            className="inline-flex items-center"
          />
        </div>
      </div>

      {/* Resume preview */}
      <div className="flex-1 overflow-y-auto rounded-lg border bg-white p-3 shadow-soft sm:p-6">
        {template === "classic" && <ClassicTemplate data={data} />}
        {template === "modern" && <ModernTemplate data={data} />}
        {template === "compact" && <CompactTemplate data={data} />}
        {template === "executive" && <ExecutiveTemplate data={data} />}
        {template === "minimal" && <MinimalTemplate data={data} />}
        {template === "creative" && <CreativeTemplate data={data} />}
        {template === "technical" && <TechnicalTemplate data={data} />}
        {template === "gradient" && <GradientTemplate data={data} />}
        {template === "sidebar" && <SidebarTemplate data={data} />}
        {template === "timeline" && <TimelineTemplate data={data} />}
        {template === "magazine" && <MagazineTemplate data={data} />}
        {template === "corporate" && <CorporateTemplate data={data} />}
        {template === "bold" && <BoldTemplate data={data} />}
      </div>
    </div>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2", className)}>
      {children}
    </h3>
  );
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-4 text-xs">
      <div className="text-center border-b pb-3">
        <h1 className="text-xl font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm text-gray-600 mt-1">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div>
          <SectionTitle>Summary</SectionTitle>
          <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle>Education</SectionTitle>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{e.degree} {e.field && `in ${e.field}`}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.institution}</p>
              {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle>Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{e.title}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
              {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[11px] text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle>Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-[11px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle>Skills</SectionTitle>
          {data.skills.map((s) => (
            <p key={s.id} className="text-[11px] mb-1">
              <span className="font-semibold">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <SectionTitle>Certifications</SectionTitle>
          {data.certifications.map((c) => (
            <p key={c.id} className="text-[11px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle>Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle>Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle>Languages</SectionTitle>
          <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle>Interests</SectionTitle>
          <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-4 text-xs">
      <div className="border-l-4 border-blue-600 pl-4">
        <h1 className="text-2xl font-bold text-gray-900">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm font-medium text-blue-600 mt-1">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div>
          <p className="text-[11px] leading-5 text-gray-700 italic">{data.personal.summary}</p>
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Education</SectionTitle>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2 flex justify-between items-start">
              <div>
                <span className="font-semibold">{e.degree} {e.field && `in ${e.field}`}</span>
                <p className="text-gray-600">{e.institution}</p>
                {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
              </div>
              <span className="text-[10px] text-gray-500 whitespace-nowrap">{e.startDate} - {e.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{e.title}</span>
                  <span className="text-gray-600"> at {e.company}</span>
                  {e.location && <span className="text-gray-500">, {e.location}</span>}
                </div>
                <span className="text-[10px] text-gray-500 whitespace-nowrap">{e.startDate} - {e.endDate}</span>
              </div>
              {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[11px] text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-[11px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Skills</SectionTitle>
          {data.skills.map((s) => (
            <p key={s.id} className="text-[11px] mb-1">
              <span className="font-semibold">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Certifications</SectionTitle>
          {data.certifications.map((c) => (
            <p key={c.id} className="text-[11px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Languages</SectionTitle>
          <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle className="text-blue-600 border-blue-600">Interests</SectionTitle>
          <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function CompactTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-2 text-[10px]">
      <div className="text-center pb-2 border-b">
        <h1 className="text-lg font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-xs text-gray-600">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-1 text-[9px] text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>| {data.personal.phone}</span>}
          {data.personal.location && <span>| {data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <p className="text-[10px] leading-4 text-gray-700">{data.personal.summary}</p>
      )}

      {data.education.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Education</h3>
          <div className="border-t mt-0.5 mb-1" />
          {data.education.map((e) => (
            <div key={e.id} className="flex justify-between mb-0.5">
              <span><span className="font-semibold">{e.degree}</span> {e.field && `${e.field}`} - {e.institution}</span>
              <span className="text-gray-500">{e.startDate}-{e.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Experience</h3>
          <div className="border-t mt-0.5 mb-1" />
          {data.experience.map((e) => (
            <div key={e.id} className="mb-1.5">
              <div className="flex justify-between">
                <span className="font-semibold">{e.title} - {e.company}</span>
                <span className="text-gray-500">{e.startDate}-{e.endDate}</span>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc pl-3 mt-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Projects</h3>
          <div className="border-t mt-0.5 mb-1" />
          {data.projects.map((p) => (
            <div key={p.id} className="mb-1">
              <span className="font-semibold">{p.name}</span> - {p.description}
              {p.technologies && <span className="text-gray-500"> [{p.technologies}]</span>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Skills</h3>
          <div className="border-t mt-0.5 mb-1" />
          {data.skills.map((s) => (
            <p key={s.id} className="mb-0.5">
              <span className="font-semibold">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Certifications</h3>
          <div className="border-t mt-0.5 mb-1" />
          {data.certifications.map((c) => (
            <p key={c.id} className="mb-0.5">{c.name} - {c.issuer} ({c.date})</p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Achievements</h3>
          <div className="border-t mt-0.5 mb-1" />
          {data.achievements.map((a) => (
            <p key={a.id} className="mb-0.5"><span className="font-semibold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Positions</h3>
          <div className="border-t mt-0.5 mb-1" />
          {data.responsibilities.map((r) => (
            <p key={r.id} className="mb-0.5">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Languages</h3>
          <div className="border-t mt-0.5 mb-1" />
          <p>{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider">Interests</h3>
          <div className="border-t mt-0.5 mb-1" />
          <p>{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-5 text-xs">
      <div className="border-b-2 border-[#1e3a5f] pb-4">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm text-gray-600 mt-1">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Summary</SectionTitle>
          <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Education</SectionTitle>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold text-[#1e3a5f]">{e.degree} {e.field && `in ${e.field}`}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.institution}</p>
              {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold text-[#1e3a5f]">{e.title}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
              {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[11px] text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-semibold text-[#1e3a5f]">{p.name}</p>
              <p className="text-[11px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Skills</SectionTitle>
          {data.skills.map((s) => (
            <p key={s.id} className="text-[11px] mb-1">
              <span className="font-semibold text-[#1e3a5f]">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Certifications</SectionTitle>
          {data.certifications.map((c) => (
            <p key={c.id} className="text-[11px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold text-[#1e3a5f]">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Languages</SectionTitle>
          <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle className="text-[#1e3a5f] border-[#1e3a5f]">Interests</SectionTitle>
          <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-5 text-xs">
      <div className="pb-3">
        <h1 className="text-2xl font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm text-gray-600 mt-1">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div>
          <SectionTitle>Summary</SectionTitle>
          <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle>Education</SectionTitle>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{e.degree} {e.field && `in ${e.field}`}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.institution}</p>
              {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle>Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{e.title}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
              {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[11px] text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle>Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-[11px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle>Skills</SectionTitle>
          {data.skills.map((s) => (
            <p key={s.id} className="text-[11px] mb-1">
              <span className="font-semibold">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <SectionTitle>Certifications</SectionTitle>
          {data.certifications.map((c) => (
            <p key={c.id} className="text-[11px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle>Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle>Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle>Languages</SectionTitle>
          <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle>Interests</SectionTitle>
          <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function CreativeTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-5 text-xs">
      <div className="bg-[#ff6b6b] text-white p-5 rounded">
        <h1 className="text-2xl font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm mt-1">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px]">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Summary</SectionTitle>
          <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Education</SectionTitle>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{e.degree} {e.field && `in ${e.field}`}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.institution}</p>
              {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{e.title}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
              {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[11px] text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-[11px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Skills</SectionTitle>
          {data.skills.map((s) => (
            <p key={s.id} className="text-[11px] mb-1">
              <span className="font-semibold">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Certifications</SectionTitle>
          {data.certifications.map((c) => (
            <p key={c.id} className="text-[11px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Languages</SectionTitle>
          <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle className="text-[#ff6b6b] border-[#ff6b6b]">Interests</SectionTitle>
          <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function TechnicalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-4 text-[10px] font-mono">
      <div className="border-b border-black pb-3">
        <h1 className="text-lg font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-xs text-gray-600">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[9px] text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div>
          <SectionTitle className="font-mono">Summary</SectionTitle>
          <p className="text-[9px] leading-4 text-gray-700">{data.personal.summary}</p>
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Education</SectionTitle>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">{e.degree} {e.field && `in ${e.field}`}</span>
                <span className="text-[8px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.institution}</p>
              {e.gpa && <p className="text-[8px] text-gray-500">GPA: {e.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-bold">{e.title}</span>
                <span className="text-[8px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
              {e.description && <p className="text-[9px] text-gray-700 mt-1">{e.description}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[9px] text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-bold">{p.name}</p>
              <p className="text-[9px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[8px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Skills</SectionTitle>
          {data.skills.map((s) => (
            <p key={s.id} className="text-[9px] mb-1">
              <span className="font-bold">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Certifications</SectionTitle>
          {data.certifications.map((c) => (
            <p key={c.id} className="text-[9px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[9px] mb-1"><span className="font-bold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[9px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Languages</SectionTitle>
          <p className="text-[9px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle className="font-mono">Interests</SectionTitle>
          <p className="text-[9px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function GradientTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-5 text-xs">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 rounded-t-lg">
        <h1 className="text-2xl font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm opacity-90 mt-1">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] opacity-80">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      <div className="px-4">
        {data.personal.summary && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Summary</SectionTitle>
            <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Education</SectionTitle>
            {data.education.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{e.degree} {e.field && `in ${e.field}`}</span>
                  <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
                </div>
                <p className="text-gray-600">{e.institution}</p>
                {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Experience</SectionTitle>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-semibold">{e.title}</span>
                  <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
                </div>
                <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
                {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-700">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Projects</SectionTitle>
            {data.projects.map((p) => (
              <div key={p.id} className="mb-2">
                <p className="font-semibold">{p.name}</p>
                <p className="text-[11px] text-gray-700">{p.description}</p>
                {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Skills</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.flatMap((s) =>
                s.items.map((item) => (
                  <span key={`${s.category}-${item}`} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Certifications</SectionTitle>
            {data.certifications.map((c) => (
              <p key={c.id} className="text-[11px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
            ))}
          </div>
        )}

        {data.achievements.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Achievements</SectionTitle>
            {data.achievements.map((a) => (
              <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
            ))}
          </div>
        )}

        {data.responsibilities.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Positions of Responsibility</SectionTitle>
            {data.responsibilities.map((r) => (
              <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
            ))}
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Languages</SectionTitle>
            <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
          </div>
        )}

        {data.interests.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-purple-600 border-purple-600">Interests</SectionTitle>
            <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex text-xs">
      {/* Sidebar */}
      <div className="w-1/3 bg-teal-600 text-white p-4">
        <h1 className="text-lg font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm opacity-90 mt-1">{data.personal.role || "Target Role"}</p>

        <div className="mt-4 space-y-1 text-[10px] opacity-80">
          {data.personal.email && <p>{data.personal.email}</p>}
          {data.personal.phone && <p>{data.personal.phone}</p>}
          {data.personal.location && <p>{data.personal.location}</p>}
        </div>

        {data.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Skills</h3>
            {data.skills.map((s) => (
              <div key={s.id} className="mb-2">
                <p className="text-[10px] font-semibold">{s.category}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {s.items.map((item) => (
                    <span key={item} className="bg-white/20 px-1.5 py-0.5 rounded text-[9px]">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Languages</h3>
            {data.languages.map((l) => (
              <p key={l.id} className="text-[10px] mb-1">{l.name} ({l.proficiency})</p>
            ))}
          </div>
        )}

        {data.certifications.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Certifications</h3>
            {data.certifications.map((c) => (
              <p key={c.id} className="text-[10px] mb-1">{c.name}</p>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="w-2/3 p-4">
        {data.personal.summary && (
          <div className="mb-4">
            <SectionTitle className="text-teal-600 border-teal-600">Summary</SectionTitle>
            <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-teal-600 border-teal-600">Experience</SectionTitle>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-semibold">{e.title}</span>
                  <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
                </div>
                <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
                {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-700">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-teal-600 border-teal-600">Education</SectionTitle>
            {data.education.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{e.degree} {e.field && `in ${e.field}`}</span>
                  <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
                </div>
                <p className="text-gray-600">{e.institution}</p>
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-teal-600 border-teal-600">Projects</SectionTitle>
            {data.projects.map((p) => (
              <div key={p.id} className="mb-2">
                <p className="font-semibold">{p.name}</p>
                <p className="text-[11px] text-gray-700">{p.description}</p>
                {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
              </div>
            ))}
          </div>
        )}

        {data.achievements.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-teal-600 border-teal-600">Achievements</SectionTitle>
            {data.achievements.map((a) => (
              <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
            ))}
          </div>
        )}

        {data.responsibilities.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-teal-600 border-teal-600">Positions of Responsibility</SectionTitle>
            {data.responsibilities.map((r) => (
              <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
            ))}
          </div>
        )}

        {data.interests.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="text-teal-600 border-teal-600">Interests</SectionTitle>
            <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-5 text-xs">
      <div className="text-center pb-4 border-b-2 border-orange-500">
        <h1 className="text-2xl font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm text-orange-500 mt-1">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="bg-orange-50 p-3 rounded">
          <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle className="text-orange-500 border-orange-500">Experience</SectionTitle>
          <div className="relative pl-6 border-l-2 border-orange-200">
            {data.experience.map((e, index) => (
              <div key={e.id} className="mb-4 relative">
                <div className="absolute -left-7 top-0 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
                <div className="flex justify-between">
                  <span className="font-semibold">{e.title}</span>
                  <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
                </div>
                <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
                {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-700">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle className="text-orange-500 border-orange-500">Education</SectionTitle>
          <div className="relative pl-6 border-l-2 border-orange-200">
            {data.education.map((e) => (
              <div key={e.id} className="mb-3 relative">
                <div className="absolute -left-7 top-0 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
                <div className="flex justify-between">
                  <span className="font-semibold">{e.degree} {e.field && `in ${e.field}`}</span>
                  <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
                </div>
                <p className="text-gray-600">{e.institution}</p>
                {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle className="text-orange-500 border-orange-500">Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-[11px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle className="text-orange-500 border-orange-500">Skills</SectionTitle>
          {data.skills.map((s) => (
            <p key={s.id} className="text-[11px] mb-1">
              <span className="font-semibold">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle className="text-orange-500 border-orange-500">Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle className="text-orange-500 border-orange-500">Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle className="text-orange-500 border-orange-500">Languages</SectionTitle>
          <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle className="text-orange-500 border-orange-500">Interests</SectionTitle>
          <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function MagazineTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-5 text-xs">
      <div className="border-b-4 border-rose-600 pb-4">
        <h1 className="text-3xl font-serif font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-sm text-rose-600 font-serif italic mt-1">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="columns-2 gap-4">
          <p className="text-[11px] leading-5 text-gray-700 font-serif">{data.personal.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle className="text-rose-600 border-rose-600">Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold font-serif">{e.title}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600 italic">{e.company}{e.location && `, ${e.location}`}</p>
              {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[11px] text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle className="text-rose-600 border-rose-600">Education</SectionTitle>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold font-serif">{e.degree} {e.field && `in ${e.field}`}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600 italic">{e.institution}</p>
              {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle className="text-rose-600 border-rose-600">Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-semibold font-serif">{p.name}</p>
              <p className="text-[11px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle className="text-rose-600 border-rose-600">Skills</SectionTitle>
          {data.skills.map((s) => (
            <p key={s.id} className="text-[11px] mb-1">
              <span className="font-semibold">{s.category}:</span> {s.items.join(", ")}
            </p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle className="text-rose-600 border-rose-600">Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle className="text-rose-600 border-rose-600">Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle className="text-rose-600 border-rose-600">Languages</SectionTitle>
          <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle className="text-rose-600 border-rose-600">Interests</SectionTitle>
          <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function CorporateTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center gap-4 pb-4 border-b-2 border-indigo-700">
        <div className="w-1 h-16 bg-indigo-700" />
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">{data.personal.name || "Your Name"}</h1>
          <p className="text-sm text-gray-600 mt-1">{data.personal.role || "Target Role"}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-500">
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
          </div>
        </div>
      </div>

      {data.personal.summary && (
        <div className="bg-indigo-50 p-3 rounded border-l-4 border-indigo-700">
          <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{e.title}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.company}{e.location && `, ${e.location}`}</p>
              {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[11px] text-gray-700">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Education</SectionTitle>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{e.degree} {e.field && `in ${e.field}`}</span>
                <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-gray-600">{e.institution}</p>
              {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-[11px] text-gray-700">{p.description}</p>
              {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Skills</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {data.skills.map((s) => (
              <div key={s.id} className="bg-gray-50 p-2 rounded">
                <p className="text-[10px] font-semibold text-indigo-700">{s.category}</p>
                <p className="text-[10px] text-gray-600">{s.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Certifications</SectionTitle>
          {data.certifications.map((c) => (
            <p key={c.id} className="text-[11px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <p key={a.id} className="text-[11px] mb-1"><span className="font-semibold">{a.title}:</span> {a.description}</p>
          ))}
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Positions of Responsibility</SectionTitle>
          {data.responsibilities.map((r) => (
            <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Languages</SectionTitle>
          <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}

      {data.interests.length > 0 && (
        <div>
          <SectionTitle className="text-indigo-700 border-indigo-700">Interests</SectionTitle>
          <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function BoldTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-5 text-xs">
      <div className="bg-amber-500 text-white p-5">
        <h1 className="text-3xl font-black uppercase tracking-wide">{data.personal.name || "Your Name"}</h1>
        <p className="text-lg font-bold mt-1 opacity-90">{data.personal.role || "Target Role"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] opacity-80">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      <div className="px-2">
        {data.personal.summary && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">About Me</h2>
            <p className="text-[11px] leading-5 text-gray-700">{data.personal.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Experience</h2>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-black text-sm">{e.title}</span>
                  <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
                </div>
                <p className="text-gray-600 font-bold">{e.company}{e.location && `, ${e.location}`}</p>
                {e.description && <p className="text-[11px] text-gray-700 mt-1">{e.description}</p>}
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-700">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Education</h2>
            {data.education.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-black text-sm">{e.degree} {e.field && `in ${e.field}`}</span>
                  <span className="text-[10px] text-gray-500">{e.startDate} - {e.endDate}</span>
                </div>
                <p className="text-gray-600 font-bold">{e.institution}</p>
                {e.gpa && <p className="text-[10px] text-gray-500">GPA: {e.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Projects</h2>
            {data.projects.map((p) => (
              <div key={p.id} className="mb-2">
                <p className="font-black text-sm">{p.name}</p>
                <p className="text-[11px] text-gray-700">{p.description}</p>
                {p.technologies && <p className="text-[10px] text-gray-500">Tech: {p.technologies}</p>}
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Skills</h2>
            {data.skills.map((s) => (
              <p key={s.id} className="text-[11px] mb-1">
                <span className="font-black">{s.category}:</span> {s.items.join(", ")}
              </p>
            ))}
          </div>
        )}

        {data.certifications.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Certifications</h2>
            {data.certifications.map((c) => (
              <p key={c.id} className="text-[11px] mb-1">{c.name} - {c.issuer} ({c.date})</p>
            ))}
          </div>
        )}

        {data.achievements.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Achievements</h2>
            {data.achievements.map((a) => (
              <p key={a.id} className="text-[11px] mb-1"><span className="font-black">{a.title}:</span> {a.description}</p>
            ))}
          </div>
        )}

        {data.responsibilities.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Positions of Responsibility</h2>
            {data.responsibilities.map((r) => (
              <p key={r.id} className="text-[11px] mb-1">{r.role} at {r.organization}</p>
            ))}
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Languages</h2>
            <p className="text-[11px]">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
          </div>
        )}

        {data.interests.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-600 border-b-4 border-amber-600 pb-1 mb-3">Interests</h2>
            <p className="text-[11px]">{data.interests.map((i) => i.name).join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
