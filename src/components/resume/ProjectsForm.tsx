import { Input } from "@/components/ui/Input";
import { FormSection, EntryCard, FieldRow } from "@/components/resume/FormSection";
import { AiImproveButton } from "@/components/common/AiImproveButton";
import type { ProjectEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";

type ProjectsFormProps = {
  data: ProjectEntry[];
  onChange: (data: ProjectEntry[]) => void;
};

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  function add() {
    onChange([
      ...data,
      { id: generateId(), name: "", description: "", technologies: "", link: "", startDate: "", endDate: "" }
    ]);
  }

  function update(id: string, field: keyof ProjectEntry, value: string) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  return (
    <FormSection addLabel="Project" onAdd={add} title="Projects">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No projects yet. Click "Project" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Project ${i + 1}`}>
          <Input
            aria-label="Project name"
            onChange={(e) => update(entry.id, "name", e.target.value)}
            placeholder="Project name"
            value={entry.name}
          />
          <textarea
            aria-label="Description"
            className="min-h-16 w-full rounded-lg border-2 border-brutal-ink bg-white p-3 text-sm font-medium shadow-hard placeholder:text-brutal-line"
            onChange={(e) => update(entry.id, "description", e.target.value)}
            placeholder="What does this project do?"
            value={entry.description}
          />
          <AiImproveButton
            bullet={entry.description}
            context={`Project: ${entry.name}. Technologies: ${entry.technologies}`}
            onAccept={(improved) => update(entry.id, "description", improved)}
          />
          <Input
            aria-label="Technologies"
            onChange={(e) => update(entry.id, "technologies", e.target.value)}
            placeholder="Technologies used (comma separated)"
            value={entry.technologies}
          />
          <Input
            aria-label="Link"
            onChange={(e) => update(entry.id, "link", e.target.value)}
            placeholder="Project link (optional)"
            value={entry.link}
          />
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
        </EntryCard>
      ))}
    </FormSection>
  );
}
