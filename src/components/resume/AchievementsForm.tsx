import { Input } from "@/components/ui/Input";
import { FormSection, EntryCard, FieldRow } from "@/components/resume/FormSection";
import type { AchievementEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";

type AchievementsFormProps = {
  data: AchievementEntry[];
  onChange: (data: AchievementEntry[]) => void;
};

export function AchievementsForm({ data, onChange }: AchievementsFormProps) {
  function add() {
    onChange([...data, { id: generateId(), title: "", description: "", date: "" }]);
  }

  function update(id: string, field: keyof AchievementEntry, value: string) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  return (
    <FormSection addLabel="Achievement" onAdd={add} title="Achievements">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No achievements yet. Click "Achievement" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Achievement ${i + 1}`}>
          <Input
            aria-label="Title"
            onChange={(e) => update(entry.id, "title", e.target.value)}
            placeholder="Achievement title"
            value={entry.title}
          />
          <textarea
            aria-label="Description"
            className="min-h-16 w-full rounded-lg border-2 border-brutal-ink bg-white p-3 text-sm font-medium shadow-hard placeholder:text-brutal-line"
            onChange={(e) => update(entry.id, "description", e.target.value)}
            placeholder="Describe the achievement"
            value={entry.description}
          />
          <FieldRow>
            <Input
              aria-label="Date"
              onChange={(e) => update(entry.id, "date", e.target.value)}
              type="month"
              value={entry.date}
            />
          </FieldRow>
        </EntryCard>
      ))}
    </FormSection>
  );
}
