import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { aiService } from "@/services/aiService";
import { Sparkles, Check, X, Loader2 } from "lucide-react";

type AiImproveButtonProps = {
  bullet: string;
  onAccept: (improved: string) => void;
  context?: string;
  jobTitle?: string;
  disabled?: boolean;
};

export function AiImproveButton({ bullet, onAccept, context, jobTitle, disabled }: AiImproveButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ improved: string; explanation: string } | null>(null);

  async function handleImprove() {
    if (!bullet.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await aiService.improveBullet({ bullet: bullet.trim(), context, jobTitle });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to improve bullet");
    } finally {
      setLoading(false);
    }
  }

  function handleAccept() {
    if (result) {
      onAccept(result.improved);
      setResult(null);
    }
  }

  function handleReject() {
    setResult(null);
  }

  if (result) {
    return (
      <div className="mt-2 rounded-lg border-2 border-brutal-sage bg-brutal-sage/10 p-3 space-y-2">
        <p className="text-sm font-medium text-brutal-ink">{result.improved}</p>
        <p className="text-xs text-muted-foreground">{result.explanation}</p>
        <div className="flex gap-2">
          <Button onClick={handleAccept} size="sm" type="button" variant="secondary">
            <Check size={14} />
            Accept
          </Button>
          <Button onClick={handleReject} size="sm" type="button" variant="ghost">
            <X size={14} />
            Reject
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleImprove}
        size="sm"
        type="button"
        variant="ghost"
        disabled={disabled || loading || !bullet.trim()}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Sparkles size={14} />
        )}
        Improve with AI
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
