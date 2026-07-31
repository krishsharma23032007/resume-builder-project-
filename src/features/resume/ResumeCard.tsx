import { Link } from "react-router-dom";
import { Copy, Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ResumeSummary } from "@/types/resume";

type ResumeCardProps = {
  resume: ResumeSummary;
  isBusy?: boolean;
  onDelete?: (resume: ResumeSummary) => void;
  onDuplicate?: (resume: ResumeSummary) => void;
};

export function ResumeCard({ isBusy = false, onDelete, onDuplicate, resume }: ResumeCardProps) {
  return (
    <Card className="flex h-full flex-col shadow-none transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge>{resume.template}</Badge>
          <h3 className="mt-4 truncate font-semibold">{resume.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{resume.role}</p>
        </div>
        <span className="shrink-0 rounded-lg border-2 border-brutal-ink bg-brutal-sage px-2 py-1 text-xs font-extrabold">
          ATS {resume.atsScore}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Updated {resume.updatedAt}</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Link className="block" to={`/resume/${resume.id}`}>
          <Button className="w-full px-2 text-xs" disabled={isBusy} size="sm" variant="outline">
            <Edit3 size={15} />
            Edit
          </Button>
        </Link>
        <Button className="px-2 text-xs" disabled={isBusy || !onDuplicate} onClick={() => onDuplicate?.(resume)} size="sm" type="button" variant="secondary">
          <Copy size={15} />
          Duplicate
        </Button>
        <Button className="px-2 text-xs" disabled={isBusy || !onDelete} onClick={() => onDelete?.(resume)} size="sm" type="button" variant="ghost">
          <Trash2 size={15} />
          Delete
        </Button>
      </div>
    </Card>
  );
}
