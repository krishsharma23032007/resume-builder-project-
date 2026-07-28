import { Sparkles } from "lucide-react";
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
        "relative grid shrink-0 place-items-center rounded-full border-2 border-brutal-ink bg-brutal-sage text-brutal-ink shadow-hard",
        selectedSize.wrap,
        className
      )}
    >
      <span className={cn("font-display font-extrabold tracking-tighter", selectedSize.text)}>
        RG
      </span>
      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full border-2 border-brutal-ink bg-brutal-yellow">
        <Sparkles size={selectedSize.icon} strokeWidth={3} />
      </span>
    </span>
  );
}
