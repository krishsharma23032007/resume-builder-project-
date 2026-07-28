import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ResumeSummary } from "@/types/resume";

export function ResumeCard({ resume }: { resume: ResumeSummary }) {
  return (
    <Card className="shadow-none transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge>{resume.template}</Badge>
          <h3 className="mt-4 font-semibold">{resume.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{resume.role}</p>
        </div>
        <Link aria-label={`Open ${resume.title}`} to={`/resume/${resume.id}`}>
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Updated {resume.updatedAt}</span>
        <span className="font-semibold text-accent">ATS {resume.atsScore}</span>
      </div>
    </Card>
  );
}
