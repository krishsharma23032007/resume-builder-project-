import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormSection, EntryCard, FieldRow } from "@/components/resume/FormSection";
import { AiImproveButton } from "@/components/common/AiImproveButton";
import { AiGrammarButton } from "@/components/common/AiGrammarButton";
import { AiSuggestButton } from "@/components/common/AiSuggestButton";
import type { ProjectEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";
import { Plus, Trash2 } from "lucide-react";

type ProjectsFormProps = {
  data: ProjectEntry[];
  onChange: (data: ProjectEntry[]) => void;
};

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  function add() {
    onChange([
      ...data,
      { id: generateId(), name: "", description: "", technologies: "", link: "", startDate: "", endDate: "", bullets: [] }
    ]);
  }

  function update(id: string, field: keyof ProjectEntry, value: string | string[]) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  function addBullet(id: string, bullet: string) {
    onChange(data.map((e) => {
      if (e.id === id) {
        const currentBullets = Array.isArray(e.bullets) ? e.bullets : [];
        return { ...e, bullets: [...currentBullets, bullet] };
      }
      return e;
    }));
  }

  function removeBullet(id: string, bulletIndex: number) {
    onChange(data.map((e) => {
      if (e.id === id && Array.isArray(e.bullets)) {
        return { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex) };
      }
      return e;
    }));
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
          <AiGrammarButton
            text={entry.description}
            onAccept={(corrected) => update(entry.id, "description", corrected)}
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

          {/* Project bullets section */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Key contributions</p>
            {Array.isArray(entry.bullets) && entry.bullets.map((bullet, bi) => (
              <div key={bi} className="flex gap-2">
                <Input
                  aria-label={`Contribution ${bi + 1}`}
                  className="flex-1"
                  onChange={(e) => {
                    const newBullets = [...(Array.isArray(entry.bullets) ? entry.bullets : [])];
                    newBullets[bi] = e.target.value;
                    update(entry.id, "bullets", newBullets);
                  }}
                  placeholder={`Key contribution ${bi + 1}`}
                  value={bullet}
                />
                <Button
                  onClick={() => removeBullet(entry.id, bi)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                onClick={() => addBullet(entry.id, "")}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus size={14} />
                Add contribution
              </Button>
              <AiSuggestButton
                role={entry.name}
                context={`${entry.description}. Technologies: ${entry.technologies}`}
                type="project"
                onInsert={(bullet) => addBullet(entry.id, bullet)}
              />
            </div>
          </div>
        </EntryCard>
      ))}
    </FormSection>
  );
}
