import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function FooterCta() {
  return (
    <>
      <section className="bg-brutal-yellow px-4 py-12 text-center sm:px-6 sm:py-20 lg:px-8">
        <h2 className="mx-auto max-w-4xl font-display text-3xl font-extrabold tracking-tighter sm:text-5xl sm:text-6xl">
          Make your next resume impossible to ignore.
        </h2>
        <Link className="mt-6 inline-block sm:mt-8" to="/register">
          <Button size="lg">Start Free Trial</Button>
        </Link>
      </section>
      <footer className="border-t-2 border-brutal-ink bg-brutal-charcoal px-4 py-8 text-brutal-sage sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4">
          {["Product", "Company", "Resources", "Social"].map((column) => (
            <div key={column}>
              <h3 className="font-display text-xl font-extrabold tracking-tighter text-white sm:text-2xl">{column}</h3>
              <div className="mt-3 space-y-2 text-xs font-bold opacity-75 sm:mt-4 sm:space-y-3 sm:text-sm">
                <p>Templates</p>
                <p>ATS analyzer</p>
                <p>Resume builder</p>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}
