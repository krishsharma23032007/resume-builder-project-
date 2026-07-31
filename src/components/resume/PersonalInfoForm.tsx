import { Input } from "@/components/ui/Input";
import { FormSection } from "@/components/resume/FormSection";
import type { ResumeProfile } from "@/types/resume";

type PersonalInfoFormProps = {
  data: ResumeProfile;
  onChange: (data: ResumeProfile) => void;
};

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  function update(field: keyof ResumeProfile, value: string) {
    onChange({ ...data, [field]: value });
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
      <textarea
        aria-label="Professional summary"
        className="min-h-20 w-full rounded-lg border-2 border-brutal-ink bg-white p-3 text-sm font-medium shadow-hard placeholder:text-brutal-line"
        onChange={(e) => update("summary", e.target.value)}
        placeholder="Professional summary (2-3 sentences)"
        value={data.summary}
      />
    </FormSection>
  );
}
