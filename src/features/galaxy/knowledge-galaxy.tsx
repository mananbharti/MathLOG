"use client";

import { useMemo, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useMathStore } from "@/store/use-math-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function KnowledgeGalaxy() {
  const { topics, phases, selectTopic } = useMathStore();
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const hoveredTopic = topics.find((topic) => topic.id === hovered);
  const activeTopic = topics.find((topic) => topic.status !== "Done" && !topic.archived) ?? topics[0];

  const nodes = useMemo(
    () =>
      topics.map((topic, index) => {
        const phaseIndex = Math.max(0, phases.findIndex((phase) => phase.id === topic.phaseId));
        const angle = index * 0.84 + phaseIndex;
        const radius = 120 + phaseIndex * 86 + (index % 4) * 18;
        return {
          topic,
          x: 620 + Math.cos(angle) * radius,
          y: 420 + Math.sin(angle) * radius,
          r: 8 + topic.confidence * 1.4
        };
      }),
    [phases, topics]
  );

  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden rounded-lg border border-white/10 bg-black/35">
      <div className="absolute left-5 top-5 z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Interactive Knowledge Galaxy</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-normal">Every topic is a planet.</h2>
      </div>
      <div className="absolute right-5 top-5 z-10 flex gap-2">
        <Button variant="outline" size="icon" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.65, value - 0.15))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.8, value + 0.15))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      <svg className="h-[760px] w-full min-w-[980px] origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }} viewBox="0 0 1240 840">
        <defs>
          <radialGradient id="planetGlow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="45%" stopColor="#56a4ff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#9b6cff" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {Array.from({ length: 120 }).map((_, index) => (
          <circle key={index} cx={(index * 97) % 1240} cy={(index * 53) % 840} r={(index % 3) + 0.5} fill="rgba(255,255,255,0.18)" />
        ))}
        {nodes.map(({ topic, x, y }) =>
          topic.dependents.map((dependentId) => {
            const target = nodes.find((node) => node.topic.id === dependentId);
            if (!target) return null;
            return <line key={`${topic.id}-${dependentId}`} x1={x} y1={y} x2={target.x} y2={target.y} stroke="rgba(96,165,250,0.22)" strokeWidth="1" />;
          })
        )}
        {nodes.map(({ topic, x, y, r }) => {
          const locked = topic.prerequisites.some((id) => (topics.find((candidate) => candidate.id === id)?.confidence ?? 0) < 6);
          const active = topic.id === activeTopic.id;
          return (
            <g key={topic.id} onMouseEnter={() => setHovered(topic.id)} onMouseLeave={() => setHovered(null)} onClick={() => selectTopic(topic.id)} className="cursor-pointer">
              {active ? <circle cx={x} cy={y} r={r + 12} fill="none" stroke="rgba(34,211,238,0.65)" strokeWidth="2"><animate attributeName="r" values={`${r + 8};${r + 18};${r + 8}`} dur="2.4s" repeatCount="indefinite" /></circle> : null}
              <circle cx={x} cy={y} r={r} fill={topic.status === "Done" ? "url(#planetGlow)" : locked ? "rgba(255,255,255,0.18)" : "rgba(96,165,250,0.72)"} opacity={locked ? 0.45 : 1} />
              <text x={x + r + 8} y={y + 4} fill="rgba(255,255,255,0.7)" fontSize="12">{topic.title}</text>
            </g>
          );
        })}
      </svg>
      {hoveredTopic ? (
        <Card className="absolute bottom-5 left-5 z-20 max-w-sm p-4">
          <div className="text-lg font-semibold">{hoveredTopic.title}</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/55">
            <span>Mastery {hoveredTopic.confidence * 10}%</span>
            <span>Confidence {hoveredTopic.confidence}/10</span>
            <span>Review {hoveredTopic.nextReview ?? "Not scheduled"}</span>
            <span>{hoveredTopic.status}</span>
          </div>
          <p className="mt-3 text-sm text-white/45">{hoveredTopic.aiSummary || "No AI summary yet."}</p>
        </Card>
      ) : null}
    </div>
  );
}
