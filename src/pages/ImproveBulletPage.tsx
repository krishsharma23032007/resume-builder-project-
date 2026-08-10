import { useState } from "react";
import { Sparkles, AlertCircle, CheckCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { resumeService, type ImproveResult } from "@/services/resumeService";

export function ImproveBulletPage() {
  const [bullet, setBullet] = useState("");
  const [context, setContext] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImproveResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleImprove() {
    if (!bullet.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await resumeService.improveBullet(bullet, context || undefined, jobTitle || undefined);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to improve bullet.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (result?.improved) {
      navigator.clipboard.writeText(result.improved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold">Improve Bullet Points</h1>
        <p className="mt-2 text-muted-foreground">
          Enhance your resume bullet points with AI to make them more impactful and action-oriented.
        </p>
      </div>

      <Card className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={24} className="text-muted-foreground" />
          <h2 className="font-semibold">Enter Bullet Point</h2>
        </div>
        <textarea
          className="w-full rounded-lg border-2 border-brutal-ink bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="e.g., Worked on the backend API and fixed bugs"
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
        />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Context (optional)</label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border-2 border-brutal-ink bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., E-commerce platform with 10k+ users"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Job Title (optional)</label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border-2 border-brutal-ink bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleImprove}
          disabled={!bullet.trim() || loading}
          className="mt-4 w-full"
        >
          {loading ? "Improving..." : "Improve Bullet Point"}
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
              <h3 className="font-semibold">Improved Version</h3>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="mt-3 text-lg leading-relaxed">{result.improved}</p>
          </Card>

          <Card>
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle size={18} className="text-blue-500" />
              What Changed
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{result.explanation}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
