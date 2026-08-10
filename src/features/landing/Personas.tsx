const personas = [
  {
    badge: "Career switcher",
    title: "Translate experience into the role you want.",
    className: "bg-brutal-sage"
  },
  {
    badge: "New graduate",
    title: "Turn projects and internships into credible proof.",
    className: "bg-brutal-yellow shadow-hard-lg"
  },
  {
    badge: "Senior operator",
    title: "Package leadership outcomes with executive clarity.",
    className: "bg-brutal-line text-white"
  }
];

export function Personas() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter sm:text-5xl">
          Built for every job hunt.
        </h2>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-3">
          {personas.map((persona) => (
            <article
              className={`min-h-48 rounded-2xl border-2 border-brutal-ink p-5 sm:min-h-64 sm:p-7 ${persona.className}`}
              key={persona.badge}
            >
              <span className="rounded-full border-2 border-brutal-ink bg-white px-3 py-1 text-xs font-extrabold text-brutal-ink">
                {persona.badge}
              </span>
              <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tighter sm:mt-8 sm:text-3xl">
                {persona.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
