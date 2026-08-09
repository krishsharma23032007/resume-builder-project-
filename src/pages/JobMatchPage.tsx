import { useState } from "react";
import { BriefcaseBusiness, AlertCircle, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useResume } from "@/context/ResumeContext";
import { resumeService, type MatchResult } from "@/services/resumeService";

export function JobMatchPage() {
  const { resumeData } = useResume();
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);

  async function handleMatch() {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await resumeService.matchResumeToJob(resumeData, jobDescription);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to match resume.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold">Job Match</h1>
        <p className="mt-2 text-muted-foreground">
          Compare your resume against a job description to find matching keywords and skill gaps.
        </p>
      </div>

      <Card className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <BriefcaseBusiness size={24} className="text-muted-foreground" />
          <h2 className="font-semibold">Paste Job Description</h2>
        </div>
        <textarea
          className="w-full rounded-lg border-2 border-brutal-ink bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          rows={8}
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button
          onClick={handleMatch}
          disabled={!jobDescription.trim() || loading}
          className="mt-4 w-full"
        >
          {loading ? "Matching..." : "Match Resume"}
        </Button>
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
              <h2 className="text-xl font-semibold">Match Score</h2>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className={result.matchPercentage >= 70 ? "text-green-500" : "text-yellow-500"} />
                <span className="text-3xl font-bold">{result.matchPercentage}%</span>
              </div>
            </div>
            <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.matchPercentage >= 70 ? "bg-green-500" : result.matchPercentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${result.matchPercentage}%` }}
              />
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                Matched Keywords ({result.matchedKeywords.length})
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.matchedKeywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {kw}
                  </span>
                ))}
                {result.matchedKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">No keywords matched.</p>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold flex items-center gap-2">
                <XCircle size={18} className="text-red-500" />
                Missing Keywords ({result.missingKeywords.length})
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.missingKeywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    {kw}
                  </span>
                ))}
                {result.missingKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">All keywords matched!</p>
                )}
              </div>
            </Card>
          </div>

          {result.skillGaps.length > 0 && (
            <Card>
              <h3 className="font-semibold">Skill Gaps</h3>
              <ul className="mt-2 space-y-1">
                {result.skillGaps.map((gap, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <AlertCircle size={14} className="text-yellow-500" />
                    {gap}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {result.recommendations.length > 0 && (
            <Card>
              <h3 className="font-semibold">Recommendations</h3>
              <ul className="mt-2 space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={14} className="mt-0.5 text-blue-500" />
                    {rec}
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
