const testimonials = [
  ["Maya", "ResumeGuru made my resume feel sharp without turning it robotic."],
  ["Dev", "The ATS score gave our hackathon demo instant credibility."],
  ["Lina", "The live preview changed how quickly I could iterate."],
];

export function Testimonials() {
  return (
    <section className="bg-brutal-sage px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-5xl font-extrabold tracking-tighter">
          Candidates feel the difference.
        </h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map(([name, quote]) => (
            <article
              className="rounded-bl-3xl rounded-br-sm rounded-tl-sm rounded-tr-3xl border-2 border-brutal-ink bg-white p-6 shadow-hard"
              key={name}
            >
              <p className="text-xl text-brutal-star">★★★★★</p>
              <p className="mt-5 text-lg font-extrabold leading-7">"{quote}"</p>
              <p className="mt-6 font-display text-2xl font-extrabold tracking-tighter">{name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
