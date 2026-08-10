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
    <section className="scroll-mt-24 border-y-2 border-brutal-ink bg-brutal-yellow" id="features">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-xs font-extrabold text-brutal-ink sm:text-sm">Product workflow</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tighter text-brutal-ink sm:text-4xl">
            Everything a serious resume product needs.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {features.map((feature) => (
            <Card className="group transition hover:-translate-y-1" key={feature.title}>
              <span className="mb-4 grid size-10 place-items-center border-2 border-brutal-ink bg-brutal-sage transition group-hover:bg-brutal-yellow sm:mb-5 sm:size-12">
                <feature.icon className="text-brutal-ink" size={20} />
              </span>
              <h3 className="font-display text-xl font-extrabold tracking-tighter sm:text-2xl">{feature.title}</h3>
              <p className="mt-2 text-xs font-bold leading-5 text-brutal-line sm:text-sm sm:leading-6">{feature.copy}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
