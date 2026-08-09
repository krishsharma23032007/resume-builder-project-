import { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { resumeService, type AnalyzeResult } from "@/services/resumeService";

export function ATSAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError(null);
    } else {
      setError("Please select a PDF file.");
    }
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await resumeService.analyzeResume(file);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold">ATS Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          Upload your resume PDF to analyze its ATS (Applicant Tracking System) compatibility.
        </p>
      </div>

      <Card className="mt-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Upload size={32} className="text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">Upload your resume</p>
            <p className="text-sm text-muted-foreground">PDF format, max 5MB</p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brutal-ink bg-white text-brutal-ink shadow-hard hover:shadow-none h-10 px-3 text-sm font-extrabold">
              Choose File
            </span>
          </label>
          {file && (
            <div className="flex items-center gap-2 text-sm">
              <FileText size={16} />
              <span>{file.name}</span>
            </div>
          )}
          <Button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full max-w-xs"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </div>
      </Card>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">ATS Score</h2>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className={result.atsScore >= 70 ? "text-green-500" : "text-yellow-500"} />
                <span className="text-3xl font-bold">{result.atsScore}%</span>
              </div>
            </div>
            <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.atsScore >= 70 ? "bg-green-500" : result.atsScore >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${result.atsScore}%` }}
              />
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <p className="text-sm text-muted-foreground">Content Score</p>
              <p className="mt-1 text-2xl font-bold">{result.contentScore}%</p>
            </Card>
            <Card>
              <p className="text-sm text-muted-foreground">Formatting Score</p>
              <p className="mt-1 text-2xl font-bold">{result.formattingScore}%</p>
            </Card>
            <Card>
              <p className="text-sm text-muted-foreground">Readability</p>
              <p className="mt-1 text-2xl font-bold">{result.readabilityScore}%</p>
            </Card>
          </div>

          {result.missingSections.length > 0 && (
            <Card>
              <h3 className="font-semibold">Missing Sections</h3>
              <ul className="mt-2 space-y-1">
                {result.missingSections.map((section) => (
                  <li key={section} className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={14} />
                    {section}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {result.suggestions.length > 0 && (
            <Card>
              <h3 className="font-semibold">Suggestions</h3>
              <ul className="mt-2 space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={14} className="mt-0.5 text-green-500" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
