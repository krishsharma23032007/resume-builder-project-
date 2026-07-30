import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border-2 border-brutal-ink bg-white px-3 text-sm font-medium text-brutal-ink shadow-hard placeholder:text-brutal-line",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
