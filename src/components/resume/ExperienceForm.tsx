import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormSection, EntryCard, FieldRow } from "@/components/resume/FormSection";
import { AiImproveButton } from "@/components/common/AiImproveButton";
import { AiGrammarButton } from "@/components/common/AiGrammarButton";
import type { ExperienceEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";
import { Plus, Trash2 } from "lucide-react";

type ExperienceFormProps = {
  data: ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
};

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  function add() {
    onChange([
      ...data,
      {
        id: generateId(),
        company: "",
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        bullets: [""]
      }
    ]);
  }

  function update(id: string, field: keyof ExperienceEntry, value: string | string[]) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  function addBullet(id: string) {
    onChange(data.map((e) => (e.id === id ? { ...e, bullets: [...e.bullets, ""] } : e)));
  }

  function updateBullet(expId: string, bulletIndex: number, value: string) {
    onChange(
      data.map((e) =>
        e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => (i === bulletIndex ? value : b)) } : e
      )
    );
  }

  function removeBullet(expId: string, bulletIndex: number) {
    onChange(
      data.map((e) =>
        e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex) } : e
      )
    );
  }

  return (
    <FormSection addLabel="Experience" onAdd={add} title="Experience">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No experience entries yet. Click "Experience" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Experience ${i + 1}`}>
          <FieldRow>
            <Input
              aria-label="Company"
              onChange={(e) => update(entry.id, "company", e.target.value)}
              placeholder="Company name"
              value={entry.company}
            />
            <Input
              aria-label="Job title"
              onChange={(e) => update(entry.id, "title", e.target.value)}
              placeholder="Job title"
              value={entry.title}
            />
          </FieldRow>
          <Input
            aria-label="Location"
            onChange={(e) => update(entry.id, "location", e.target.value)}
            placeholder="Location (optional)"
            value={entry.location}
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
          <textarea
            aria-label="Description"
            className="min-h-16 w-full rounded-lg border-2 border-brutal-ink bg-white p-3 text-sm font-medium shadow-hard placeholder:text-brutal-line"
            onChange={(e) => update(entry.id, "description", e.target.value)}
            placeholder="Brief role description (optional)"
            value={entry.description}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Bullet points</p>
            {entry.bullets.map((bullet, bi) => (
              <div key={bi} className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    aria-label={`Bullet ${bi + 1}`}
                    className="flex-1"
                    onChange={(e) => updateBullet(entry.id, bi, e.target.value)}
                    placeholder={`Achievement or responsibility ${bi + 1}`}
                    value={bullet}
                  />
                  {entry.bullets.length > 1 && (
                    <Button
                      onClick={() => removeBullet(entry.id, bi)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  )}
                </div>
                <AiImproveButton
                  bullet={bullet}
                  context={entry.description}
                  jobTitle={entry.title}
                  onAccept={(improved) => updateBullet(entry.id, bi, improved)}
                />
                <AiGrammarButton
                  text={bullet}
                  onAccept={(corrected) => updateBullet(entry.id, bi, corrected)}
                />
              </div>
            ))}
            <Button onClick={() => addBullet(entry.id)} size="sm" type="button" variant="outline">
              <Plus size={14} />
              Add bullet
            </Button>
          </div>
        </EntryCard>
      ))}
    </FormSection>
  );
}
