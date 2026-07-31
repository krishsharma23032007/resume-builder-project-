import { Input } from "@/components/ui/Input";
import { FormSection, EntryCard } from "@/components/resume/FormSection";
import type { SkillEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";

type SkillsFormProps = {
  data: SkillEntry[];
  onChange: (data: SkillEntry[]) => void;
};

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  function add() {
    onChange([...data, { id: generateId(), category: "", items: [""] }]);
  }

  function update(id: string, field: keyof SkillEntry, value: string | string[]) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  return (
    <FormSection addLabel="Skill category" onAdd={add} title="Skills">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No skills yet. Click "Skill category" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Category ${i + 1}`}>
          <Input
            aria-label="Category"
            onChange={(e) => update(entry.id, "category", e.target.value)}
            placeholder="Category (e.g. Programming Languages, Frameworks)"
            value={entry.category}
          />
          <Input
            aria-label="Skills"
            onChange={(e) => update(entry.id, "items", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="Skills (comma separated)"
            value={entry.items.join(", ")}
          />
        </EntryCard>
      ))}
    </FormSection>
  );
}
