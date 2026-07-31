import { Input } from "@/components/ui/Input";
import { FormSection, EntryCard } from "@/components/resume/FormSection";
import type { InterestEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";

type InterestsFormProps = {
  data: InterestEntry[];
  onChange: (data: InterestEntry[]) => void;
};

export function InterestsForm({ data, onChange }: InterestsFormProps) {
  function add() {
    onChange([...data, { id: generateId(), name: "" }]);
  }

  function update(id: string, value: string) {
    onChange(data.map((e) => (e.id === id ? { ...e, name: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  return (
    <FormSection addLabel="Interest" onAdd={add} title="Interests">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No interests yet. Click "Interest" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Interest ${i + 1}`}>
          <Input
            aria-label="Interest"
            onChange={(e) => update(entry.id, e.target.value)}
            placeholder="e.g. Open source, Chess, Photography"
            value={entry.name}
          />
        </EntryCard>
      ))}
    </FormSection>
  );
}
