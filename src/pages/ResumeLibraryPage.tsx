import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ResumeCard } from "@/features/resume/ResumeCard";
import { useResume } from "@/context/ResumeContext";

export function ResumeLibraryPage() {
  const { resumes } = useResume();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Resume library</h1>
          <p className="mt-2 text-muted-foreground">Search, sort, and compare active versions.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={17} />
            <Input className="pl-9" placeholder="Search resumes" />
          </div>
          <Button variant="outline">
            <Filter size={17} />
            Filter
          </Button>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resumes.map((resume) => <ResumeCard key={resume.id} resume={resume} />)}
      </div>
    </div>
  );
}
