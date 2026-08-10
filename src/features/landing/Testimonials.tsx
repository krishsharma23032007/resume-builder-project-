const testimonials = [
  ["Maya", "ResumeGuru made my resume feel sharp without turning it robotic."],
  ["Dev", "The ATS score gave our hackathon demo instant credibility."],
  ["Lina", "The live preview changed how quickly I could iterate."],
];

export function Testimonials() {
  return (
    <section className="bg-brutal-sage px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter sm:text-5xl">
          Candidates feel the difference.
        </h2>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-3">
          {testimonials.map(([name, quote]) => (
            <article
              className="rounded-bl-3xl rounded-br-sm rounded-tl-sm rounded-tr-3xl border-2 border-brutal-ink bg-white p-4 shadow-hard sm:p-6"
              key={name}
            >
              <p className="text-lg text-brutal-star sm:text-xl">★★★★★</p>
              <p className="mt-4 text-base font-extrabold leading-6 sm:mt-5 sm:text-lg sm:leading-7">"{quote}"</p>
              <p className="mt-4 font-display text-xl font-extrabold tracking-tighter sm:mt-6 sm:text-2xl">{name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
