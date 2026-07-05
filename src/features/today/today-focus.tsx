"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Focus, Play, X, RotateCcw } from "lucide-react";
import { useMathStore } from "@/store/use-math-store";
import { getReviewQueue } from "@/lib/spaced-repetition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function TodayFocus() {
  const { topics, addSession, reviewTopic, selectTopic } = useMathStore();
  const [sessionOpen, setSessionOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes in seconds
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextTopic = topics.find((topic) => topic.status !== "Done" && !topic.archived) ?? topics[0];
  const reviews = getReviewQueue(topics).slice(0, 3);
  const mission = useMemo(() => {
    if (reviews.length) return `Review ${reviews[0].title}`;
    return `Study ${nextTopic.title}`;
  }, [nextTopic.title, reviews]);

  // Timer logic
  useEffect(() => {
    if (sessionOpen) {
      if (!sessionStartTime) {
        setSessionStartTime(new Date());
      }
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      // Reset when closed
      setTimeLeft(50 * 60);
      setSessionStartTime(null);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionOpen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const completeSession = () => {
    const now = new Date();
    // Calculate actual elapsed minutes, min 1
    const elapsedMinutes = sessionStartTime 
      ? Math.max(1, Math.round((now.getTime() - sessionStartTime.getTime()) / 60_000))
      : 50;
      
    addSession({
      topicId: nextTopic.id,
      startTime: sessionStartTime?.toISOString() || new Date(now.getTime() - elapsedMinutes * 60_000).toISOString(),
      endTime: now.toISOString(),
      durationMinutes: elapsedMinutes,
      notes: "",
      aiQuestions: [],
      resourcesOpened: [],
      confidenceBefore: nextTopic.confidence,
      confidenceAfter: Math.min(10, nextTopic.confidence + 1)
    });
    setSessionOpen(false);
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-140px)] max-w-5xl place-items-center">
      <Card className="w-full overflow-hidden">
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                <Focus className="h-6 w-6 text-cyan-200" />
              </div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Today's Mission</p>
              <h2 className="mt-3 max-w-3xl text-5xl font-semibold tracking-normal text-white sm:text-6xl">{mission}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">
                Everything else can wait. Start one clean block, capture one insight, and let the system build from real work.
              </p>
            </div>
            <div className="grid gap-3 sm:min-w-72">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">Review</p>
                <p className="mt-2 text-xl font-semibold">{reviews[0]?.title ?? "Nothing due"}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">Study</p>
                <p className="mt-2 text-xl font-semibold">{nextTopic.title}</p>
              </div>
              <Button variant="primary" className="h-12" onClick={() => setSessionOpen(true)}>
                <Play className="h-4 w-4" />
                Start Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {sessionOpen ? (
          <motion.div className="fixed inset-0 z-[70] bg-[#050608]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex min-h-screen flex-col p-6 sm:p-10">
              <div className="flex items-center justify-between">
                <div className="text-sm uppercase tracking-[0.18em] text-white/35">Focus Session</div>
                <Button variant="outline" size="icon" onClick={() => setSessionOpen(false)} aria-label="Close session">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid flex-1 place-items-center">
                <div className="max-w-3xl text-center">
                  <Clock className="mx-auto h-10 w-10 text-cyan-200" />
                  <div className={`mt-8 text-7xl font-semibold tracking-normal sm:text-8xl tabular-nums ${timeLeft === 0 ? "text-red-400" : ""}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <h2 className="mt-8 text-4xl font-semibold tracking-normal">{nextTopic.title}</h2>
                  <p className="mt-4 text-white/50">Write one insight, one question, and one example before ending.</p>
                  
                  <div className="mt-6 flex justify-center gap-4">
                    {timeLeft === 0 ? (
                      <p className="text-cyan-300 font-semibold animate-pulse">Session complete! Great work.</p>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setTimeLeft(50 * 60)} className="text-white/30 hover:text-white/60">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>

                  <div className="mt-10 flex justify-center gap-3">
                    <Button
                      variant="primary"
                      onClick={completeSession}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {timeLeft === 0 ? "Log Session" : "End & Log Early"}
                    </Button>
                    {reviews[0] ? (
                      <Button variant="outline" onClick={() => reviewTopic(reviews[0].id, 4)}>
                        Mark Review Good
                      </Button>
                    ) : null}
                    <Button variant="outline" onClick={() => { selectTopic(nextTopic.id); setSessionOpen(false); }}>
                      Open Topic
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
