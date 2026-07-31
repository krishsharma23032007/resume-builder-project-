import { Link } from "react-router-dom";
import { FileText, Gauge, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/features/dashboard/MetricCard";
import { useResume } from "@/context/ResumeContext";

export function DashboardPage() {
  const { resumeData } = useResume();

  const totalEntries =
    resumeData.education.length +
    resumeData.experience.length +
    resumeData.projects.length +
    resumeData.skills.length +
    resumeData.certifications.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Optimize, tailor, and ship your next resume.</p>
        </div>
        <Link to="/resume/new">
          <Button>
            <Plus size={18} />
            New resume
          </Button>
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard detail="Across active resumes" icon={FileText} label="Sections" value={String(totalEntries)} />
        <MetricCard detail="Best active version" icon={Gauge} label="Top ATS score" value="--" />
        <MetricCard detail="Generated this week" icon={Sparkles} label="AI rewrites" value="--" />
      </div>
      <div className="mt-8">
        <Card>
          <h2 className="font-semibold">Your Resume</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {resumeData.personal.name
              ? `Building resume for ${resumeData.personal.name} - ${resumeData.personal.role}`
              : "Start building your resume by filling in your personal information."}
          </p>
          <Link className="mt-4 inline-block" to="/resume/new">
            <Button size="sm">
              <Plus size={16} />
              {resumeData.personal.name ? "Edit resume" : "Start building"}
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
