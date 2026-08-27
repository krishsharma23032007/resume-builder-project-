import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, TrendingUp, Lightbulb } from "lucide-react";
import type { ResumeData } from "@/types/resume";
import { scoreResumeLive } from "@/utils/atsScorer";

type Props = {
  resumeData: ResumeData;
};

export function LiveAtsScore({ resumeData }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [debouncedData, setDebouncedData] = useState(resumeData);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDebouncedData(resumeData), 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resumeData]);

  const result = useMemo(() => scoreResumeLive(debouncedData), [debouncedData]);

  const colorClass =
    result.atsScore >= 70
      ? "bg-green-500"
      : result.atsScore >= 50
        ? "bg-yellow-500"
        : "bg-red-500";

  const textColorClass =
    result.atsScore >= 70
      ? "text-green-700"
      : result.atsScore >= 50
        ? "text-yellow-700"
        : "text-red-700";

  return (
    <div className="fixed top-16 right-4 z-50 w-56 select-none">
      {/* Badge */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border-2 border-brutal-ink bg-white px-4 py-2.5 shadow-hard transition-all hover:shadow-none"
      >
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${colorClass}`} />
          <span className="text-sm font-bold">ATS</span>
          <span className={`text-lg font-extrabold ${textColorClass}`}>
            {result.atsScore}%
          </span>
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="mt-1 rounded-xl border-2 border-brutal-ink bg-white p-4 shadow-hard">
          {/* Sub-scores */}
          <div className="space-y-2.5">
            <ScoreRow label="Content" value={result.contentScore} />
            <ScoreRow label="Formatting" value={result.formattingScore} />
            <ScoreRow label="Readability" value={result.readabilityScore} />
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Lightbulb size={12} />
                Tips
              </div>
              <ul className="space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground leading-snug">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const barColor =
    value >= 70 ? "bg-green-500" : value >= 50 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
