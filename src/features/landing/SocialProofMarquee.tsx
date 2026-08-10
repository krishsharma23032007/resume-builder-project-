const brands = ["ACME", "GLOBEX", "INITECH", "UMBRELLA", "Hooli", "VANDelay"];

export function SocialProofMarquee() {
  const repeatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="overflow-hidden border-b-2 border-brutal-ink bg-brutal-charcoal py-6 sm:py-8">
      <div className="flex w-max animate-marquee gap-8 sm:gap-12">
        {repeatedBrands.map((brand, index) => (
          <span
            className="font-display text-2xl font-extrabold tracking-tighter text-brutal-sage opacity-50 sm:text-4xl"
            key={`${brand}-${index}`}
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
