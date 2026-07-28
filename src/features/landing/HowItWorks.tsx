const steps = [
  ["01", "Import", "Start from an existing resume or structured blank state."],
  ["02", "Optimize", "AI improves bullets, keywords, and impact language."],
  ["03", "Export", "Preview a clean A4 resume and prepare download flows."]
];

export function HowItWorks() {
  return (
    <section className="bg-brutal-charcoal px-4 py-20 text-white sm:px-6 lg:px-8" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-5xl font-extrabold tracking-tighter">
          How it works
        </h2>
        <div className="relative mt-14 grid gap-8 lg:grid-cols-3">
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-brutal-line lg:block" />
          {steps.map(([number, title, copy], index) => (
            <article className="relative" key={number}>
              <span
                className={[
                  "grid size-24 place-items-center rounded-full border-4 bg-brutal-charcoal font-display text-3xl font-extrabold",
                  index === 0 ? "border-brutal-sage" : "",
                  index === 1 ? "border-brutal-yellow text-brutal-yellow" : "",
                  index === 2 ? "border-white" : ""
                ].join(" ")}
              >
                {number}
              </span>
              <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tighter">{title}</h3>
              <p className="mt-3 max-w-sm text-base font-bold leading-7 text-brutal-sage">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
