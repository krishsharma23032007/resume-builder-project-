import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useResume } from "@/context/ResumeContext";

export function ResumeLibraryPage() {
  const { resumeData } = useResume();

  const hasResume = resumeData.personal.name || resumeData.education.length > 0 || resumeData.experience.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Resume library</h1>
          <p className="mt-2 text-muted-foreground">Your saved resumes and drafts.</p>
        </div>
        <Link to="/resume/new">
          <Button>
            <Plus size={16} />
            New resume
          </Button>
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hasResume ? (
          <Card>
            <h3 className="font-semibold">{resumeData.personal.name || "Untitled Resume"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{resumeData.personal.role || "No role specified"}</p>
            <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
              <span>{resumeData.education.length} education</span>
              <span>{resumeData.experience.length} experience</span>
              <span>{resumeData.skills.length} skills</span>
            </div>
            <Link className="mt-4 inline-block" to="/resume/new">
              <Button size="sm" variant="outline">Edit</Button>
            </Link>
          </Card>
        ) : (
          <Card className="col-span-full">
            <p className="text-muted-foreground">No resumes yet. Create your first resume to get started.</p>
            <Link className="mt-4 inline-block" to="/resume/new">
              <Button size="sm">
                <Plus size={16} />
                Create resume
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
