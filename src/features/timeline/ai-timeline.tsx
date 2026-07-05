"use client";

import { CalendarClock, Sparkles } from "lucide-react";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AITimeline() {
  const { topics, sessions } = useMathStore();
  const firstTopic = topics.find((topic) => topic.status !== "Done" && !topic.archived) ?? topics[0];
  const events = [
    ...sessions.map((session) => ({
      date: new Date(session.endTime).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      title: `Studied ${topics.find((topic) => topic.id === session.topicId)?.title ?? "topic"}`,
      body: `${session.durationMinutes} minutes. Confidence moved from ${session.confidenceBefore} to ${session.confidenceAfter}.`
    })),
    {
      date: "Next",
      title: `AI suggests starting ${firstTopic.title}`,
      body: "This is the first available topic in your current curriculum path."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Timeline</CardTitle>
        <CalendarClock className="h-4 w-4 text-white/35" />
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-2 h-full w-px bg-gradient-to-b from-blue-400 via-violet-400 to-transparent" />
          <div className="space-y-5">
            {events.map((event, index) => (
              <div key={`${event.date}-${event.title}`} className="relative pl-12">
                <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black">
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/35">{event.date}</div>
                  <div className="mt-2 text-lg font-semibold">{event.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/50">{event.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
