import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/resume/FormSection";
import { aiService } from "@/services/aiService";
import type { ResumeProfile } from "@/types/resume";
import { Sparkles, Loader2 } from "lucide-react";

type PersonalInfoFormProps = {
  data: ResumeProfile;
  onChange: (data: ResumeProfile) => void;
  resumeData: Record<string, unknown>;
};

export function PersonalInfoForm({ data, onChange, resumeData }: PersonalInfoFormProps) {
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  function update(field: keyof ResumeProfile, value: string) {
    onChange({ ...data, [field]: value });
  }

  async function handleGenerateSummary() {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const response = await aiService.generateSummary({ resumeContent: JSON.stringify(resumeData) });
      update("summary", response.summary);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : "Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  }

  return (
    <FormSection title="Personal Information">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          aria-label="Full name"
          onChange={(e) => update("name", e.target.value)}
          placeholder="Full name"
          value={data.name}
        />
        <Input
          aria-label="Role"
          onChange={(e) => update("role", e.target.value)}
          placeholder="Target role"
          value={data.role}
        />
        <Input
          aria-label="Email"
          onChange={(e) => update("email", e.target.value)}
          placeholder="Email address"
          type="email"
          value={data.email}
        />
        <Input
          aria-label="Phone"
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Phone number"
          value={data.phone}
        />
        <Input
          aria-label="Location"
          onChange={(e) => update("location", e.target.value)}
          placeholder="City, State"
          value={data.location}
        />
      </div>
      <div className="space-y-2">
        <textarea
          aria-label="Professional summary"
          className="min-h-20 w-full rounded-lg border-2 border-brutal-ink bg-white p-3 text-sm font-medium shadow-hard placeholder:text-brutal-line"
          onChange={(e) => update("summary", e.target.value)}
          placeholder="Professional summary (2-3 sentences)"
          value={data.summary}
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={handleGenerateSummary}
            size="sm"
            type="button"
            variant="ghost"
            disabled={summaryLoading}
          >
            {summaryLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {summaryLoading ? "Generating..." : "Generate Summary"}
          </Button>
          {summaryError && <span className="text-xs text-red-500">{summaryError}</span>}
        </div>
      </div>
    </FormSection>
  );
}
