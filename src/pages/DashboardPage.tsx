import { Link } from "react-router-dom";
import { FileText, Gauge, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/features/dashboard/MetricCard";
import { ResumeCard } from "@/features/resume/ResumeCard";
import { useResume } from "@/context/ResumeContext";

export function DashboardPage() {
  const { resumes } = useResume();

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
        <MetricCard detail="Across active resumes" icon={FileText} label="Resumes" value="12" />
        <MetricCard detail="Best active version" icon={Gauge} label="Top ATS score" value="92" />
        <MetricCard detail="Generated this week" icon={Sparkles} label="AI rewrites" value="48" />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent resumes</h2>
            <Link className="text-sm text-primary" to="/resumes">View all</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {resumes.map((resume) => <ResumeCard key={resume.id} resume={resume} />)}
          </div>
        </section>
        <Card>
          <p className="text-sm font-semibold text-primary">ATS analysis</p>
          <h2 className="mt-2 text-xl font-semibold">Product Design Lead</h2>
          <div className="mt-6 grid place-items-center rounded-lg bg-muted py-10">
            <div className="grid size-32 place-items-center rounded-full border-8 border-accent text-3xl font-semibold">
              92
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Strong keyword alignment. Add one quantified leadership result to improve recruiter signal.
          </p>
        </Card>
      </div>
    </div>
  );
}
