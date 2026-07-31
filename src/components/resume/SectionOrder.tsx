import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ResumeSectionKey } from "@/types/resume";

const sectionLabels: Record<ResumeSectionKey, string> = {
  personal: "Personal Information",
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
  languages: "Languages",
  interests: "Interests",
  responsibilities: "Positions of Responsibility"
};

type SectionOrderProps = {
  order: ResumeSectionKey[];
  onChange: (order: ResumeSectionKey[]) => void;
};

export function SectionOrder({ order, onChange }: SectionOrderProps) {
  function moveUp(index: number) {
    if (index === 0) return;
    const newOrder = [...order];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    onChange(newOrder);
  }

  function moveDown(index: number) {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    onChange(newOrder);
  }

  return (
    <Card>
      <h2 className="font-semibold">Section Order</h2>
      <p className="mt-1 text-sm text-muted-foreground">Drag to reorder sections on your resume.</p>
      <div className="mt-3 space-y-1">
        {order.map((key, index) => (
          <div
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
            key={key}
          >
            <GripVertical size={14} className="text-muted-foreground cursor-grab" />
            <span className="flex-1 text-sm">{sectionLabels[key]}</span>
            <Button
              disabled={index === 0}
              onClick={() => moveUp(index)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <ChevronUp size={14} />
            </Button>
            <Button
              disabled={index === order.length - 1}
              onClick={() => moveDown(index)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <ChevronDown size={14} />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
