import type { ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, variant = "ghost", size = "md", ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "glow-button border-transparent px-8 py-3 text-[15px] font-semibold tracking-wide",
        variant === "ghost" && "border-transparent bg-transparent text-white/75 hover:bg-white/10 hover:text-white",
        variant === "outline" && "border-white/10 bg-white/[0.03] text-white/85 hover:bg-white/[0.08] hover:border-white/20 hover:text-white",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4",
        size === "icon" && "h-9 w-9 p-0",
        className
      )}
      {...props}
    />
  );
}
