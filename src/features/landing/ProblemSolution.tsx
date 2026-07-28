import { Check, X } from "lucide-react";

const problems = ["Generic bullets", "Missing keywords", "Unclear impact"];
const solutions = ["AI rewrite guidance", "ATS-ready scoring", "Recruiter-grade structure"];

export function ProblemSolution() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <Panel
          items={problems}
          tone="problem"
          title="Most resumes hide the signal."
        />
        <Panel
          items={solutions}
          tone="solution"
          title="ResumeGuru makes the signal loud."
        />
      </div>
    </section>
  );
}

function Panel({
  items,
  title,
  tone
}: {
  items: string[];
  title: string;
  tone: "problem" | "solution";
}) {
  const isSolution = tone === "solution";

  return (
    <article
      className={
        isSolution
          ? "rounded-3xl border-2 border-brutal-ink bg-brutal-yellow p-8 shadow-hard-lg"
          : "rounded-3xl border-2 border-dashed border-zinc-400 bg-zinc-100 p-8 opacity-70"
      }
    >
      <h2 className="font-display text-4xl font-extrabold tracking-tighter text-brutal-ink">
        {title}
      </h2>
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li className="flex items-center gap-3 text-lg font-extrabold" key={item}>
            <span className="grid size-8 place-items-center border-2 border-brutal-ink bg-white">
              {isSolution ? <Check size={18} /> : <X size={18} />}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
