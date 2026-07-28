import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function FooterCta() {
  return (
    <>
      <section className="bg-brutal-yellow px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tighter sm:text-6xl">
          Make your next resume impossible to ignore.
        </h2>
        <Link className="mt-8 inline-block" to="/register">
          <Button size="lg">Start Free Trial</Button>
        </Link>
      </section>
      <footer className="border-t-2 border-brutal-ink bg-brutal-charcoal px-4 py-12 text-brutal-sage sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          {["Product", "Company", "Resources", "Social"].map((column) => (
            <div key={column}>
              <h3 className="font-display text-2xl font-extrabold tracking-tighter text-white">{column}</h3>
              <div className="mt-4 space-y-3 text-sm font-bold opacity-75">
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
