import { Input } from "@/components/ui/Input";
import { FormSection, EntryCard, FieldRow } from "@/components/resume/FormSection";
import type { LanguageEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";

type LanguagesFormProps = {
  data: LanguageEntry[];
  onChange: (data: LanguageEntry[]) => void;
};

export function LanguagesForm({ data, onChange }: LanguagesFormProps) {
  function add() {
    onChange([...data, { id: generateId(), name: "", proficiency: "intermediate" }]);
  }

  function update(id: string, field: keyof LanguageEntry, value: string) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  return (
    <FormSection addLabel="Language" onAdd={add} title="Languages">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No languages yet. Click "Language" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Language ${i + 1}`}>
          <FieldRow>
            <Input
              aria-label="Language"
              onChange={(e) => update(entry.id, "name", e.target.value)}
              placeholder="Language name"
              value={entry.name}
            />
            <select
              aria-label="Proficiency"
              className="h-11 w-full rounded-xl border-2 border-brutal-ink bg-white px-3 text-sm font-medium shadow-hard"
              onChange={(e) => update(entry.id, "proficiency", e.target.value)}
              value={entry.proficiency}
            >
              <option value="beginner">Beginner</option>
              <option value="elementary">Elementary</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="native">Native</option>
            </select>
          </FieldRow>
        </EntryCard>
      ))}
    </FormSection>
  );
}
