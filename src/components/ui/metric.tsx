import { cn } from "@/lib/utils";

export function Metric({ label, value, detail, className }: { label: string; value: string; detail?: string; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-white/10 bg-white/[0.035] p-4", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/40">{label}</p>
      <div className="mt-3 text-xl font-semibold tracking-normal text-white 2xl:text-2xl">{value}</div>
      {detail ? <p className="mt-2 text-sm text-white/50">{detail}</p> : null}
    </div>
  );
}
