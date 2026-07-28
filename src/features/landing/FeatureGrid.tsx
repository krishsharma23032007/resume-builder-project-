import { BrainCircuit, FileCheck2, LayoutPanelTop, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  {
    title: "ATS analyzer",
    copy: "Surface keyword gaps, formatting risks, and relevance signals before sending.",
    icon: FileCheck2
  },
  {
    title: "AI writing assist",
    copy: "Turn rough responsibilities into concise, impact-focused bullet points.",
    icon: Wand2
  },
  {
    title: "Live preview",
    copy: "Edit on the left and watch a print-ready A4 resume update instantly.",
    icon: LayoutPanelTop
  },
  {
    title: "Resume intelligence",
    copy: "Use structured state that can connect cleanly to a backend later.",
    icon: BrainCircuit
  }
];

export function FeatureGrid() {
  return (
    <section className="border-y-2 border-brutal-ink bg-brutal-yellow" id="features">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-extrabold text-brutal-ink">Product workflow</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tighter text-brutal-ink">
            Everything a serious resume product needs.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card className="group transition hover:-translate-y-1" key={feature.title}>
              <span className="mb-5 grid size-12 place-items-center border-2 border-brutal-ink bg-brutal-sage transition group-hover:bg-brutal-yellow">
                <feature.icon className="text-brutal-ink" size={24} />
              </span>
              <h3 className="font-display text-2xl font-extrabold tracking-tighter">{feature.title}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-brutal-line">{feature.copy}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
