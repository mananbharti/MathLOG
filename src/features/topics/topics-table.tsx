"use client";

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight, CheckCircle2, PlayCircle } from "lucide-react";
import { useMemo } from "react";
import { useMathStore } from "@/store/use-math-store";
import type { Topic } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";

export function TopicsTable() {
  const { topics, phases, selectTopic, selectedTopicId, setTopicStatus, reviewTopic, setActiveView } = useMathStore();

  const columns = useMemo<ColumnDef<Topic>[]>(
    () => [
      {
        header: "Topic",
        accessorKey: "title",
        cell: ({ row }) => (
          <button className="text-left font-medium text-white hover:text-blue-200" onClick={() => selectTopic(row.original.id)}>
            {row.original.title}
          </button>
        )
      },
      {
        header: "Phase",
        cell: ({ row }) => phases.find((phase) => phase.id === row.original.phaseId)?.name
      },
      {
        header: "Status",
        cell: ({ row }) => <StatusPill status={row.original.status} />
      },
      {
        header: "Confidence",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-white/10">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" style={{ width: `${row.original.confidence * 10}%` }} />
            </div>
            <span className="text-white/45">{row.original.confidence}/10</span>
          </div>
        )
      },
      {
        header: "Hours",
        cell: ({ row }) => `${row.original.actualHours}/${row.original.estimatedHours}h`
      },
      {
        header: "Next Review",
        accessorKey: "nextReview"
      },
      {
        header: "Tags",
        cell: ({ row }) => <span className="text-white/45">{row.original.tags.join(", ")}</span>
      }
    ],
    [phases, selectTopic]
  );

  const table = useReactTable({ data: topics, columns, getCoreRowModel: getCoreRowModel() });
  const selected = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Topics Database</CardTitle>
          <span className="text-xs text-white/35">{topics.length} normalized learning records</span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="scrollbar-soft overflow-auto">
            <table className="min-w-[920px] w-full border-collapse text-sm">
              <thead className="bg-white/[0.035] text-left text-xs uppercase tracking-[0.14em] text-white/35">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border-b border-white/10 px-4 py-3 font-medium">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 transition hover:bg-white/[0.035]">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-white/70">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topic Inspector</CardTitle>
          <Button variant="outline" size="icon" aria-label="Open topic" onClick={() => setActiveView("Notes")}>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-normal">{selected.title}</h2>
            <StatusPill status={selected.status} />
          </div>
          <p className="mt-4 text-sm leading-6 text-white/55">{selected.aiSummary || "No AI summary yet. Add notes or ask the AI Coach to create one."}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setTopicStatus(selected.id, "Learning")}>
              <PlayCircle className="h-4 w-4" />
              Start
            </Button>
            <Button variant="primary" onClick={() => setTopicStatus(selected.id, "Done")}>
              <CheckCircle2 className="h-4 w-4" />
              Complete
            </Button>
            <Button variant="outline" onClick={() => reviewTopic(selected.id, 2)}>Forgot</Button>
            <Button variant="outline" onClick={() => reviewTopic(selected.id, 4)}>Review Good</Button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <div className="text-white/35">Difficulty</div>
              <div className="mt-1 font-semibold">{selected.difficulty}/5</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <div className="text-white/35">Ease Factor</div>
              <div className="mt-1 font-semibold">{selected.easeFactor}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <div className="text-white/35">Prerequisites</div>
              <div className="mt-1 font-semibold">{selected.prerequisites.length}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <div className="text-white/35">Dependents</div>
              <div className="mt-1 font-semibold">{selected.dependents.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
