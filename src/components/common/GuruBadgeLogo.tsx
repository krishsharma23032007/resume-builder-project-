import { FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type GuruBadgeLogoProps = {
  size?: "sm" | "md";
  className?: string;
};

const sizes = {
  sm: {
    wrap: "size-9",
    text: "text-sm",
    icon: 10
  },
  md: {
    wrap: "size-11",
    text: "text-base",
    icon: 12
  }
};

export function GuruBadgeLogo({ size = "md", className }: GuruBadgeLogoProps) {
  const selectedSize = sizes[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid shrink-0 place-items-center rounded-xl border-2 border-brutal-ink bg-white text-brutal-ink shadow-hard",
        selectedSize.wrap,
        className
      )}
    >
      <FileText size={size === "md" ? 23 : 19} strokeWidth={3} />
      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full border-2 border-brutal-ink bg-brutal-yellow text-brutal-ink">
        <Sparkles size={selectedSize.icon} strokeWidth={3} />
      </span>
    </span>
  );
}
