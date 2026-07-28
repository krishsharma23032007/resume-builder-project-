import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border-2 border-brutal-ink bg-white p-5 text-brutal-ink shadow-hard", className)}
      {...props}
    />
  );
}
