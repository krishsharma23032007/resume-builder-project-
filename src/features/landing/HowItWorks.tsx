const steps = [
  ["01", "Import", "Start from an existing resume or structured blank state."],
  ["02", "Optimize", "AI improves bullets, keywords, and impact language."],
  ["03", "Export", "Preview a clean A4 resume and prepare download flows."]
];

export function HowItWorks() {
  return (
    <section className="scroll-mt-24 bg-brutal-charcoal px-4 py-12 text-white sm:px-6 sm:py-20 lg:px-8" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter sm:text-5xl">
          How it works
        </h2>
        <div className="relative mt-8 grid gap-8 sm:mt-14 lg:grid-cols-3">
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-brutal-line lg:block" />
          {steps.map(([number, title, copy], index) => (
            <article className="relative" key={number}>
              <span
                className={[
                  "grid size-16 place-items-center rounded-full border-4 bg-brutal-charcoal font-display text-xl font-extrabold sm:size-24 sm:text-3xl",
                  index === 0 ? "border-brutal-sage" : "",
                  index === 1 ? "border-brutal-yellow text-brutal-yellow" : "",
                  index === 2 ? "border-white" : ""
                ].join(" ")}
              >
                {number}
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tighter sm:mt-6 sm:text-3xl">{title}</h3>
              <p className="mt-2 max-w-sm text-sm font-bold leading-6 text-brutal-sage sm:mt-3 sm:text-base sm:leading-7">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
