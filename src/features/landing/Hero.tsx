import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="dot-pattern bg-brutal-yellow pt-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-24">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-center"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.45 }}
      >
        <Badge className="mb-4 w-fit gap-2 sm:mb-6">
          <Sparkles size={14} />
          NEW: AI Content Assistant 2.0
        </Badge>
        <h1 className="max-w-4xl font-display text-4xl font-extrabold tracking-tighter text-brutal-ink sm:text-6xl sm:text-7xl lg:text-8xl">
          Build resumes that <span className="text-stroke">beat ATS</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-brutal-ink sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
          Build polished, ATS-ready resumes with live scoring, tailored suggestions,
          recruiter-grade templates, and a focused editing workflow.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
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
        <div className="mt-6 grid gap-3 text-xs font-extrabold text-brutal-ink sm:mt-8 sm:grid-cols-3 sm:text-sm">
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
        className="rounded-2xl border-2 border-brutal-ink bg-white p-3 shadow-browser sm:p-4"
        initial={{ opacity: 0, scale: 0.97 }}
        transition={{ delay: 0.15, duration: 0.45 }}
      >
        <div className="overflow-hidden rounded-xl border-2 border-brutal-ink bg-white">
          <div className="flex h-8 items-center gap-2 bg-brutal-ink px-3 sm:h-10 sm:px-4">
            <span className="size-2 rounded-full bg-[#ff5f57] sm:size-3" />
            <span className="size-2 rounded-full bg-[#febc2e] sm:size-3" />
            <span className="size-2 rounded-full bg-[#28c840] sm:size-3" />
          </div>
          <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between border-b-2 border-brutal-ink pb-4 sm:pb-5">
            <div>
              <p className="font-display text-lg font-extrabold sm:text-2xl">Avery Morgan</p>
              <p className="text-xs font-extrabold text-brutal-charcoal sm:text-sm">Senior Product Designer</p>
            </div>
            <Badge className="bg-brutal-sage text-xs sm:text-sm">ATS 92</Badge>
          </div>
          <div className="grid gap-3 py-4 sm:gap-5 sm:py-6">
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
      <p className="mb-1 text-[10px] font-extrabold uppercase text-brutal-line sm:mb-2 sm:text-xs">{title}</p>
      <div className="space-y-1 sm:space-y-2">
        {lines.map((line) => (
          <div className="rounded-lg border-2 border-brutal-ink bg-brutal-sage px-2 py-1.5 text-xs font-bold sm:px-3 sm:py-2 sm:text-sm" key={line}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
