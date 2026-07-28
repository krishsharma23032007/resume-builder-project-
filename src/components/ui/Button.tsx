import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brutal-ink text-sm font-extrabold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 hover:translate-x-1 hover:translate-y-1",
  {
    variants: {
      variant: {
        primary: "bg-brutal-ink text-white shadow-hard-lg hover:shadow-hard",
        secondary: "bg-brutal-sage text-brutal-ink shadow-hard hover:shadow-none",
        ghost: "bg-transparent text-brutal-ink shadow-none hover:bg-white",
        outline: "bg-white text-brutal-ink shadow-hard hover:shadow-none"
      },
      size: {
        sm: "h-10 px-3",
        md: "h-11 px-5",
        lg: "h-14 px-7 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
