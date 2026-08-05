import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { resumeService, type ParseResult } from "@/services/resumeService";
import { UploadCloud, FileText, Loader2, Check, X, ChevronDown, ChevronUp } from "lucide-react";

type ResumeImportModalProps = {
  onImport: (data: ParseResult) => void;
  onClose: () => void;
};

export function ResumeImportModal({ onImport, onClose }: ResumeImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [parsedData, setParsedData] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"upload" | "preview" | "confirm">("upload");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  async function handleExtractText() {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      // Use pdf.js or similar to extract text from PDF
      // For now, we'll use a simple approach - send the file to the analyze endpoint
      // which already extracts text
      const analysis = await resumeService.analyzeResume(file);
      setExtractedText(analysis.extractedText);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract text from PDF");
    } finally {
      setLoading(false);
    }
  }

  async function handleParse() {
    if (!extractedText.trim()) return;
    setLoading(true);
    setError("");

    try {
      const result = await resumeService.parseResume(extractedText);
      setParsedData(result.parsed);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse resume");
    } finally {
      setLoading(false);
    }
  }

  function handleImport() {
    if (parsedData) {
      onImport(parsedData);
      onClose();
    }
  }

  function toggleSection(section: string) {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }

  function renderSectionPreview(title: string, content: React.ReactNode, sectionKey: string) {
    const isExpanded = expandedSections[sectionKey];
    return (
      <div className="rounded-lg border-2 border-brutal-ink bg-white p-3">
        <button
          className="flex w-full items-center justify-between text-sm font-medium"
          onClick={() => toggleSection(sectionKey)}
          type="button"
        >
          <span>{title}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {isExpanded && <div className="mt-2 text-xs text-muted-foreground">{content}</div>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border-2 border-brutal-ink bg-white shadow-hard">
        <div className="flex items-center justify-between border-b-2 border-brutal-ink p-4">
          <h2 className="text-lg font-semibold">Import Resume</h2>
          <Button onClick={onClose} size="sm" type="button" variant="ghost">
            <X size={18} />
          </Button>
        </div>

        <div className="p-4">
          {step === "upload" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a PDF resume to extract and import its content into the builder.
              </p>

              <div className="rounded-xl border-2 border-dashed border-brutal-ink bg-background p-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-xl border-2 border-brutal-ink bg-brutal-yellow">
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-extrabold">{file ? file.name : "Choose a PDF resume"}</p>
                    <p className="text-xs text-muted-foreground">PDF files only</p>
                  </div>
                  <Input
                    accept="application/pdf"
                    className="max-w-sm"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    type="file"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2">
                <Button onClick={onClose} size="sm" type="button" variant="outline">
                  Cancel
                </Button>
                <Button
                  disabled={!file || loading}
                  onClick={handleExtractText}
                  size="sm"
                  type="button"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                  {loading ? "Extracting..." : "Extract Text"}
                </Button>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review the extracted text below, then click Parse to structure the data.
              </p>

              <div className="max-h-64 overflow-y-auto rounded-lg border-2 border-brutal-ink bg-background p-3 text-xs leading-5">
                {extractedText || "No text extracted."}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2">
                <Button onClick={() => setStep("upload")} size="sm" type="button" variant="outline">
                  Back
                </Button>
                <Button
                  disabled={!extractedText.trim() || loading}
                  onClick={handleParse}
                  size="sm"
                  type="button"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                  {loading ? "Parsing..." : "Parse Resume"}
                </Button>
              </div>
            </div>
          )}

          {step === "confirm" && parsedData && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review the parsed sections below. Click Import to add this data to your resume builder.
              </p>

              <div className="space-y-2">
                {renderSectionPreview(
                  "Personal Information",
                  <div className="space-y-1">
                    <p><strong>Name:</strong> {parsedData.personal.name || "-"}</p>
                    <p><strong>Role:</strong> {parsedData.personal.role || "-"}</p>
                    <p><strong>Email:</strong> {parsedData.personal.email || "-"}</p>
                    <p><strong>Phone:</strong> {parsedData.personal.phone || "-"}</p>
                    <p><strong>Location:</strong> {parsedData.personal.location || "-"}</p>
                    <p><strong>Summary:</strong> {parsedData.personal.summary || "-"}</p>
                  </div>,
                  "personal"
                )}

                {renderSectionPreview(
                  `Experience (${parsedData.experience.length} entries)`,
                  <div className="space-y-2">
                    {parsedData.experience.map((exp, i) => (
                      <div key={i} className="rounded border p-2">
                        <p className="font-medium">{exp.title} at {exp.company}</p>
                        <p>{exp.startDate} - {exp.endDate}</p>
                        {exp.bullets.length > 0 && (
                          <ul className="mt-1 list-disc pl-4">
                            {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>,
                  "experience"
                )}

                {renderSectionPreview(
                  `Education (${parsedData.education.length} entries)`,
                  <div className="space-y-2">
                    {parsedData.education.map((edu, i) => (
                      <div key={i} className="rounded border p-2">
                        <p className="font-medium">{edu.degree} {edu.field}</p>
                        <p>{edu.institution}</p>
                        <p>{edu.startDate} - {edu.endDate}</p>
                      </div>
                    ))}
                  </div>,
                  "education"
                )}

                {renderSectionPreview(
                  `Skills (${parsedData.skills.length} categories)`,
                  <div className="space-y-2">
                    {parsedData.skills.map((skill, i) => (
                      <div key={i}>
                        <p className="font-medium">{skill.category}:</p>
                        <p>{skill.items.join(", ")}</p>
                      </div>
                    ))}
                  </div>,
                  "skills"
                )}

                {renderSectionPreview(
                  `Projects (${parsedData.projects.length} entries)`,
                  <div className="space-y-2">
                    {parsedData.projects.map((proj, i) => (
                      <div key={i} className="rounded border p-2">
                        <p className="font-medium">{proj.name}</p>
                        <p>{proj.description}</p>
                        {proj.technologies && <p className="text-muted-foreground">Tech: {proj.technologies}</p>}
                      </div>
                    ))}
                  </div>,
                  "projects"
                )}

                {renderSectionPreview(
                  `Certifications (${parsedData.certifications.length})`,
                  <div className="space-y-1">
                    {parsedData.certifications.map((cert, i) => (
                      <p key={i}>{cert.name} - {cert.issuer}</p>
                    ))}
                  </div>,
                  "certifications"
                )}

                {renderSectionPreview(
                  `Languages (${parsedData.languages.length})`,
                  <div className="space-y-1">
                    {parsedData.languages.map((lang, i) => (
                      <p key={i}>{lang.name} - {lang.proficiency}</p>
                    ))}
                  </div>,
                  "languages"
                )}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2">
                <Button onClick={() => setStep("preview")} size="sm" type="button" variant="outline">
                  Back
                </Button>
                <Button onClick={handleImport} size="sm" type="button">
                  <Check size={14} />
                  Import to Builder
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
