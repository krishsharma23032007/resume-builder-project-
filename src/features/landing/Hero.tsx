import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="dot-pattern bg-brutal-yellow pt-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-center"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.45 }}
      >
        <Badge className="mb-6 w-fit gap-2">
          <Sparkles size={14} />
          NEW: AI Content Assistant 2.0
        </Badge>
        <h1 className="max-w-4xl font-display text-6xl font-extrabold tracking-tighter text-brutal-ink sm:text-7xl lg:text-8xl">
          Build resumes that <span className="text-stroke">beat ATS</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl font-bold leading-8 text-brutal-ink">
          Build polished, ATS-ready resumes with live scoring, tailored suggestions,
          recruiter-grade templates, and a focused editing workflow.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/resume/new">
            <Button size="lg">
              Create resume
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline">View dashboard</Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-3 text-sm font-extrabold text-brutal-ink sm:grid-cols-3">
          {["ATS score insights", "Live A4 preview", "Backend-ready state"].map((item) => (
            <span className="flex items-center gap-2" key={item}>
              <CheckCircle2 className="text-brutal-charcoal" size={17} />
              {item}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border-2 border-brutal-ink bg-white p-4 shadow-browser"
        initial={{ opacity: 0, scale: 0.97 }}
        transition={{ delay: 0.15, duration: 0.45 }}
      >
        <div className="overflow-hidden rounded-xl border-2 border-brutal-ink bg-white">
          <div className="flex h-10 items-center gap-2 bg-brutal-ink px-4">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="p-6">
          <div className="flex items-start justify-between border-b-2 border-brutal-ink pb-5">
            <div>
              <p className="font-display text-2xl font-extrabold">Avery Morgan</p>
              <p className="text-sm font-extrabold text-brutal-charcoal">Senior Product Designer</p>
            </div>
            <Badge className="bg-brutal-sage">ATS 92</Badge>
          </div>
          <div className="grid gap-5 py-6">
            <PreviewBlock title="Experience" lines={["Led AI workflow redesign", "Raised activation by 31%"]} />
            <PreviewBlock title="Projects" lines={["Resume intelligence engine", "Design system migration"]} />
            <PreviewBlock title="Skills" lines={["Product strategy", "Figma", "Research", "AI UX"]} />
          </div>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}

function PreviewBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-extrabold uppercase text-brutal-line">{title}</p>
      <div className="space-y-2">
        {lines.map((line) => (
          <div className="rounded-lg border-2 border-brutal-ink bg-brutal-sage px-3 py-2 text-sm font-bold" key={line}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
