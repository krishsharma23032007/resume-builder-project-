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
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 select-none xl:left-[calc(50%-210px)]">
      {/* Badge */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border-2 border-brutal-ink bg-white px-2.5 py-1 text-xs shadow-hard transition-all hover:shadow-none"
      >
        <div className={`h-2 w-2 rounded-full ${colorClass}`} />
        <span className="font-bold">ATS</span>
        <span className={`font-extrabold ${textColorClass}`}>
          {result.atsScore}%
        </span>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="absolute bottom-full left-1/2 mb-1 w-44 -translate-x-1/2 rounded-lg border-2 border-brutal-ink bg-white p-2.5 shadow-hard">
          {/* Sub-scores */}
          <div className="space-y-1.5">
            <ScoreRow label="Content" value={result.contentScore} />
            <ScoreRow label="Formatting" value={result.formattingScore} />
            <ScoreRow label="Readability" value={result.readabilityScore} />
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Lightbulb size={10} />
                Tips
              </div>
              <ul className="space-y-0.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-[10px] text-muted-foreground leading-snug">
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
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
