import { Input } from "@/components/ui/Input";
import { FormSection, EntryCard, FieldRow } from "@/components/resume/FormSection";
import type { ResponsibilityEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";

type ResponsibilitiesFormProps = {
  data: ResponsibilityEntry[];
  onChange: (data: ResponsibilityEntry[]) => void;
};

export function ResponsibilitiesForm({ data, onChange }: ResponsibilitiesFormProps) {
  function add() {
    onChange([
      ...data,
      { id: generateId(), role: "", organization: "", startDate: "", endDate: "", description: "" }
    ]);
  }

  function update(id: string, field: keyof ResponsibilityEntry, value: string) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  return (
    <FormSection addLabel="Position" onAdd={add} title="Positions of Responsibility">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No positions yet. Click "Position" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Position ${i + 1}`}>
          <FieldRow>
            <Input
              aria-label="Role"
              onChange={(e) => update(entry.id, "role", e.target.value)}
              placeholder="Role (e.g. President, Volunteer)"
              value={entry.role}
            />
            <Input
              aria-label="Organization"
              onChange={(e) => update(entry.id, "organization", e.target.value)}
              placeholder="Organization name"
              value={entry.organization}
            />
          </FieldRow>
          <FieldRow>
            <Input
              aria-label="Start date"
              onChange={(e) => update(entry.id, "startDate", e.target.value)}
              type="month"
              value={entry.startDate}
            />
            <Input
              aria-label="End date"
              onChange={(e) => update(entry.id, "endDate", e.target.value)}
              type="month"
              value={entry.endDate}
            />
          </FieldRow>
          <textarea
            aria-label="Description"
            className="min-h-16 w-full rounded-lg border-2 border-brutal-ink bg-white p-3 text-sm font-medium shadow-hard placeholder:text-brutal-line"
            onChange={(e) => update(entry.id, "description", e.target.value)}
            placeholder="What did you do in this role?"
            value={entry.description}
          />
        </EntryCard>
      ))}
    </FormSection>
  );
}
