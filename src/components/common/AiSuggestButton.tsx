import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { aiService } from "@/services/aiService";
import { Lightbulb, Plus, X, Loader2 } from "lucide-react";

type AiSuggestButtonProps = {
  role: string;
  context?: string;
  type?: "experience" | "project";
  onInsert: (bullet: string) => void;
  disabled?: boolean;
};

export function AiSuggestButton({ role, context, type = "experience", onInsert, disabled }: AiSuggestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [customContext, setCustomContext] = useState("");

  async function handleSuggest() {
    if (!role.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const response = await aiService.suggestAchievements({
        role: role.trim(),
        context: customContext || context,
        type
      });
      setSuggestions(response.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suggest achievements");
    } finally {
      setLoading(false);
    }
  }

  function handleInsert(bullet: string) {
    onInsert(bullet);
    setSuggestions(suggestions.filter(s => s !== bullet));
  }

  function handleDismiss() {
    setSuggestions([]);
    setError(null);
    setShowInput(false);
    setCustomContext("");
  }

  if (suggestions.length > 0) {
    return (
      <div className="mt-2 rounded-lg border-2 border-brutal-yellow bg-brutal-yellow/10 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-brutal-ink">Suggested achievements</p>
          <Button onClick={handleDismiss} size="sm" type="button" variant="ghost">
            <X size={14} />
          </Button>
        </div>
        <ul className="space-y-1">
          {suggestions.map((suggestion, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brutal-ink" />
              <span className="flex-1 text-xs text-muted-foreground">{suggestion}</span>
              <Button
                onClick={() => handleInsert(suggestion)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Plus size={14} />
                Insert
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="mt-2 space-y-2">
        <div className="flex gap-2">
          <Input
            className="flex-1"
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Add context for better suggestions (optional)"
            value={customContext}
          />
          <Button onClick={handleSuggest} size="sm" type="button" disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Lightbulb size={14} />}
            {loading ? "Suggesting..." : "Suggest"}
          </Button>
          <Button onClick={() => setShowInput(false)} size="sm" type="button" variant="ghost">
            <X size={14} />
          </Button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          if (role.trim()) {
            handleSuggest();
          } else {
            setShowInput(true);
          }
        }}
        size="sm"
        type="button"
        variant="ghost"
        disabled={disabled || loading || !role.trim()}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Lightbulb size={14} />
        )}
        Suggest Achievements
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
