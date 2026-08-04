import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { aiService } from "@/services/aiService";
import { SpellCheck, Check, X, Loader2 } from "lucide-react";

type AiGrammarButtonProps = {
  text: string;
  onAccept: (corrected: string) => void;
  disabled?: boolean;
};

export function AiGrammarButton({ text, onAccept, disabled }: AiGrammarButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ corrected: string; changes: string } | null>(null);

  async function handleFixGrammar() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await aiService.fixGrammar({ text: text.trim() });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fix grammar");
    } finally {
      setLoading(false);
    }
  }

  function handleAccept() {
    if (result) {
      onAccept(result.corrected);
      setResult(null);
    }
  }

  function handleReject() {
    setResult(null);
  }

  if (result) {
    return (
      <div className="mt-2 rounded-lg border-2 border-brutal-sage bg-brutal-sage/10 p-3 space-y-2">
        <p className="text-sm font-medium text-brutal-ink">{result.corrected}</p>
        <p className="text-xs text-muted-foreground">{result.changes}</p>
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
        onClick={handleFixGrammar}
        size="sm"
        type="button"
        variant="ghost"
        disabled={disabled || loading || !text.trim()}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <SpellCheck size={14} />
        )}
        Fix Grammar
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
