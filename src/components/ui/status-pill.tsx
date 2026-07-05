import { cn } from "@/lib/utils";
import type { TopicStatus } from "@/lib/types";

const styles: Record<TopicStatus, string> = {
  "Not Started": "border-white/10 bg-white/[0.035] text-white/45",
  Learning: "border-blue-400/20 bg-blue-400/10 text-blue-200",
  Practicing: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
  Done: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  Frozen: "border-violet-400/20 bg-violet-400/10 text-violet-100"
};

export function StatusPill({ status, className }: { status: TopicStatus; className?: string }) {
  return <span className={cn("rounded-full border px-2.5 py-1 text-xs font-medium", styles[status], className)}>{status}</span>;
}
