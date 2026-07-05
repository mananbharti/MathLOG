"use client";

import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from "reactflow";
import { useMemo } from "react";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KnowledgeGraph() {
  const { topics, phases, selectTopic } = useMathStore();

  const nodes = useMemo<Node[]>(
    () =>
      topics.map((topic, index) => {
        const phaseIndex = Math.max(0, phases.findIndex((phase) => phase.id === topic.phaseId));
        const topicsInPhase = topics.filter((candidate) => candidate.phaseId === topic.phaseId);
        const topicIndex = Math.max(0, topicsInPhase.findIndex((candidate) => candidate.id === topic.id));
        const unlocked = topic.prerequisites.every((id) => (topics.find((candidate) => candidate.id === id)?.confidence ?? 0) >= 6);
        return {
          id: topic.id,
          position: { x: phaseIndex * 300 + 80, y: topicIndex * 104 + 40 },
          data: { label: `${topic.title}${unlocked || topic.prerequisites.length === 0 ? "" : " (locked)"}` },
          style: {
            width: 190,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.12)",
            background: `linear-gradient(135deg, rgba(59,130,246,${topic.confidence / 16}), rgba(139,92,246,${topic.confidence / 18}))`,
            color: "white",
            boxShadow: unlocked ? "0 12px 40px rgba(59,130,246,0.16)" : "none",
            opacity: unlocked || topic.prerequisites.length === 0 ? 1 : 0.48
          }
        };
      }),
    [phases, topics]
  );

  const edges = useMemo<Edge[]>(
    () =>
      topics.flatMap((topic) =>
        topic.dependents.map((dependent) => ({
          id: `${topic.id}-${dependent}`,
          source: topic.id,
          target: dependent,
          animated: topic.confidence >= 6,
          style: { stroke: "rgba(96,165,250,0.65)" }
        }))
      ),
    [topics]
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Knowledge Graph</CardTitle>
        <span className="text-xs text-white/35">Prerequisites, unlocks, and mastery color</span>
      </CardHeader>
      <CardContent className="h-[720px] p-0">
        <ReactFlow nodes={nodes} edges={edges} fitView onNodeClick={(_, node) => selectTopic(node.id)} proOptions={{ hideAttribution: true }}>
          <Background color="rgba(255,255,255,0.08)" gap={32} />
          <Controls className="!border-white/10 !bg-black/50 !text-white" />
          <MiniMap pannable zoomable nodeColor={(node) => (node.style?.opacity === 0.48 ? "#334155" : "#60a5fa")} maskColor="rgba(0,0,0,0.55)" />
        </ReactFlow>
      </CardContent>
    </Card>
  );
}
