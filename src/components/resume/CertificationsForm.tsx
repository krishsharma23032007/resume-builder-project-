import { Input } from "@/components/ui/Input";
import { FormSection, EntryCard, FieldRow } from "@/components/resume/FormSection";
import type { CertificationEntry } from "@/types/resume";
import { generateId } from "@/utils/generateId";

type CertificationsFormProps = {
  data: CertificationEntry[];
  onChange: (data: CertificationEntry[]) => void;
};

export function CertificationsForm({ data, onChange }: CertificationsFormProps) {
  function add() {
    onChange([...data, { id: generateId(), name: "", issuer: "", date: "", link: "" }]);
  }

  function update(id: string, field: keyof CertificationEntry, value: string) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }

  return (
    <FormSection addLabel="Certification" onAdd={add} title="Certifications">
      {data.length === 0 && <p className="text-sm text-muted-foreground">No certifications yet. Click "Certification" to add one.</p>}
      {data.map((entry, i) => (
        <EntryCard key={entry.id} onDelete={() => remove(entry.id)} title={`Certification ${i + 1}`}>
          <Input
            aria-label="Name"
            onChange={(e) => update(entry.id, "name", e.target.value)}
            placeholder="Certification name"
            value={entry.name}
          />
          <FieldRow>
            <Input
              aria-label="Issuer"
              onChange={(e) => update(entry.id, "issuer", e.target.value)}
              placeholder="Issuing organization"
              value={entry.issuer}
            />
            <Input
              aria-label="Date"
              onChange={(e) => update(entry.id, "date", e.target.value)}
              type="month"
              value={entry.date}
            />
          </FieldRow>
          <Input
            aria-label="Link"
            onChange={(e) => update(entry.id, "link", e.target.value)}
            placeholder="Credential link (optional)"
            value={entry.link}
          />
        </EntryCard>
      ))}
    </FormSection>
  );
}
