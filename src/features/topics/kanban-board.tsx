"use client";

import { useMathStore } from "@/store/use-math-store";
import type { TopicStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";

const columns: TopicStatus[] = ["Not Started", "Learning", "Practicing", "Done", "Frozen"];

export function KanbanBoard() {
  const { topics, selectTopic } = useMathStore();

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {columns.map((status) => {
        const columnTopics = topics.filter((topic) => topic.status === status);
        return (
          <Card key={status} className="min-h-[640px]">
            <CardHeader>
              <CardTitle>{status}</CardTitle>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/45">{columnTopics.length}</span>
            </CardHeader>
            <CardContent className="space-y-3">
              {columnTopics.map((topic) => (
                <button key={topic.id} onClick={() => selectTopic(topic.id)} className="w-full rounded-lg border border-white/10 bg-white/[0.035] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.06]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-white">{topic.title}</div>
                    <StatusPill status={topic.status} className="shrink-0" />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-5 text-white/45">{topic.aiSummary}</p>
                  <div className="mt-4 h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" style={{ width: `${topic.confidence * 10}%` }} />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
