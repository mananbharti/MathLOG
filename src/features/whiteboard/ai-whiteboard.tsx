"use client";

import { Circle, MoveRight, PenLine, Sigma, Loader2, Bot } from "lucide-react";
import { useState } from "react";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AIWhiteboard() {
  const { topics, selectedTopicId } = useMathStore();
  const selected = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  async function explainTopic() {
    if (isExplaining) return;
    setIsExplaining(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "explain",
          topicTitle: selected.title,
          confidence: selected.confidence
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setExplanation(data.content);
    } catch (err) {
      console.error(err);
      setExplanation("Failed to generate explanation. Check API key settings.");
    } finally {
      setIsExplaining(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>AI Whiteboard</CardTitle>
        <Button variant="primary" size="sm" onClick={explainTopic} disabled={isExplaining}>
          {isExplaining ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
          Explain {selected.title}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[620px] overflow-hidden bg-black/35">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {explanation ? (
            <div className="absolute inset-0 z-10 overflow-auto p-8 bg-black/60 backdrop-blur-sm">
              <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-black/80 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3 text-lg font-semibold">
                    <Bot className="h-6 w-6 text-cyan-400" />
                    AI Explanation: {selected.title}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setExplanation(null)}>Close</Button>
                </div>
                <div className="prose prose-invert prose-cyan max-w-none text-white/80 whitespace-pre-wrap leading-relaxed">
                  {explanation}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute left-[10%] top-[18%] rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <Sigma className="h-6 w-6 text-cyan-200" />
                <div className="mt-3 text-2xl font-semibold">Concept</div>
                <p className="mt-2 text-sm text-white/50">Ask AI to draw the derivation here.</p>
              </div>
              <MoveRight className="absolute left-[34%] top-[31%] h-16 w-16 text-blue-200/50" />
              <div className="absolute left-[48%] top-[20%] rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <Circle className="h-6 w-6 text-violet-200" />
                <div className="mt-3 text-2xl font-semibold">Geometry</div>
                <p className="mt-2 text-sm text-white/50">Vectors, arrows, curves, and equations.</p>
              </div>
              <MoveRight className="absolute left-[68%] top-[31%] h-16 w-16 text-blue-200/50" />
              <div className="absolute right-[8%] top-[18%] rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="text-2xl font-semibold">Practice</div>
                <p className="mt-2 text-sm text-white/50">Turn the board into SM-2 memory cards.</p>
              </div>
              <div className="absolute bottom-8 left-8 right-8 rounded-lg border border-white/10 bg-black/50 p-4 text-sm text-white/55 backdrop-blur-xl">
                Infinite canvas placeholder wired into the app shell. A production version can connect Excalidraw/Tldraw and stream AI-generated shapes from OpenRouter. Click "Explain" above to view an AI breakdown.
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
