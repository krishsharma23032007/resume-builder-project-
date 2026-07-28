import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 border-brutal-ink bg-white px-3 py-1.5 text-xs font-extrabold text-brutal-ink",
        className
      )}
      {...props}
    />
  );
}
