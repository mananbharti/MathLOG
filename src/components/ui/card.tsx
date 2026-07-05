import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("glass rounded-xl transition-all duration-300 hover:shadow-2xl hover:border-white/20 hover:-translate-y-0.5", className)} 
      {...props} 
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("flex items-start justify-between gap-4 border-b border-white/[0.08] bg-white/[0.01] px-5 py-4 rounded-t-xl", className)} 
      {...props} 
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 
      className={cn("text-[15px] font-semibold tracking-tight text-white", className)} 
      {...props} 
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("p-5", className)} 
      {...props} 
    />
  );
}
