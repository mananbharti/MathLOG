"use client";

import { motion } from "framer-motion";

export function MasteryRing({ value }: { value: number }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const hue = Math.min(135, Math.max(0, value * 1.35));

  return (
    <div className="relative flex aspect-square min-h-56 items-center justify-center">
      <svg viewBox="0 0 180 180" className="h-56 w-56 -rotate-90">
        <circle cx="90" cy="90" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          stroke={`hsl(${hue} 82% 55%)`}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-5xl font-semibold tracking-normal">{value}%</div>
        <div className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">Mastery</div>
      </div>
    </div>
  );
}
