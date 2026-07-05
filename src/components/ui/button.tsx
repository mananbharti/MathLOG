import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, variant = "ghost", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "border-transparent bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-950/30",
        variant === "ghost" && "border-transparent bg-transparent text-white/75",
        variant === "outline" && "border-white/10 bg-white/[0.04] text-white/85",
        size === "sm" && "h-8 px-3",
        size === "md" && "h-10 px-4",
        size === "icon" && "h-9 w-9 p-0",
        className
      )}
      {...props}
    />
  );
}
