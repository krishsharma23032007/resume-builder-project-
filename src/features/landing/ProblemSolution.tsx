import { Check, X } from "lucide-react";

const problems = ["Generic bullets", "Missing keywords", "Unclear impact"];
const solutions = ["AI rewrite guidance", "ATS-ready scoring", "Recruiter-grade structure"];

export function ProblemSolution() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 sm:gap-6 lg:grid-cols-2">
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
          ? "rounded-3xl border-2 border-brutal-ink bg-brutal-yellow p-5 shadow-hard-lg sm:p-8"
          : "rounded-3xl border-2 border-dashed border-zinc-400 bg-zinc-100 p-5 opacity-70 sm:p-8"
      }
    >
      <h2 className="font-display text-2xl font-extrabold tracking-tighter text-brutal-ink sm:text-4xl">
        {title}
      </h2>
      <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
        {items.map((item) => (
          <li className="flex items-center gap-3 text-base font-extrabold sm:text-lg" key={item}>
            <span className="grid size-7 shrink-0 place-items-center border-2 border-brutal-ink bg-white sm:size-8">
              {isSolution ? <Check size={16} /> : <X size={16} />}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
