import { Badge } from "@/components/ui/Badge";

const templates = ["Executive", "Modern", "Classic", "Compact", "Creative", "Technical"];

export function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold">Templates</h1>
      <p className="mt-2 text-muted-foreground">Commercial-grade resume layouts ready for builder integration.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {templates.map((template) => (
          <div className="aspect-[3/4] rounded-lg border bg-card p-5 shadow-soft" key={template}>
            <Badge>{template}</Badge>
            <div className="mt-8 space-y-3">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-3 rounded bg-muted" />
              <div className="h-3 w-5/6 rounded bg-muted" />
              <div className="mt-6 h-20 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
