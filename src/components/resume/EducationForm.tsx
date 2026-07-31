import { Input } from "@/components/ui/Input";
import { FormSection, EntryCard, FieldRow } from "@/components/resume/FormSection";
import type { EducationEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";

type EducationFormProps = {
  data: EducationEntry[];
  onChange: (data: EducationEntry[]) => void;
};

export function EducationForm({ data, onChange }: EducationFormProps) {
  function add() {
    onChange([
      ...data,
      { id: generateId(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }
    ]);
  }

  function update(id: string, field: keyof EducationEntry, value: string) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  return (
    <FormSection addLabel="Education" onAdd={add} title="Education">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No education entries yet. Click "Education" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Education ${i + 1}`}>
          <FieldRow>
            <Input
              aria-label="Institution"
              onChange={(e) => update(entry.id, "institution", e.target.value)}
              placeholder="Institution name"
              value={entry.institution}
            />
            <Input
              aria-label="Degree"
              onChange={(e) => update(entry.id, "degree", e.target.value)}
              placeholder="Degree (e.g. B.S.)"
              value={entry.degree}
            />
          </FieldRow>
          <Input
            aria-label="Field of study"
            onChange={(e) => update(entry.id, "field", e.target.value)}
            placeholder="Field of study"
            value={entry.field}
          />
          <FieldRow>
            <Input
              aria-label="Start date"
              onChange={(e) => update(entry.id, "startDate", e.target.value)}
              placeholder="Start date"
              type="month"
              value={entry.startDate}
            />
            <Input
              aria-label="End date"
              onChange={(e) => update(entry.id, "endDate", e.target.value)}
              placeholder="End date"
              type="month"
              value={entry.endDate}
            />
          </FieldRow>
          <Input
            aria-label="GPA"
            onChange={(e) => update(entry.id, "gpa", e.target.value)}
            placeholder="GPA (optional)"
            value={entry.gpa}
          />
        </EntryCard>
      ))}
    </FormSection>
  );
}
