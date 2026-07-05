"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCircle2, Clock, Focus, Play, X, RotateCcw, Camera } from "lucide-react";
import { useMathStore } from "@/store/use-math-store";
import { getReviewQueue } from "@/lib/spaced-repetition";
import { Button } from "@/components/ui/button";

export function TodayFocus() {
  const { topics, addSession, reviewTopic, selectTopic } = useMathStore();
  const [sessionOpen, setSessionOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextTopic = topics.find((topic) => topic.status !== "Done" && !topic.archived) ?? topics[0];
  const reviews = getReviewQueue(topics).slice(0, 3);
  
  const tags = ["Exact curriculum", "No AI shortcuts", "Instant retention"];

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
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center py-20">
      
      {/* Top Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        Powered by AI Coach
      </motion.div>

      {/* Headline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="mt-8 text-center"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white/90">
          Any math topic. <br />
          <span className="text-gradient italic font-serif">Perfect</span> understanding.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/50">
          Dive deep into {nextTopic?.title || "your curriculum"}.
          <br /> Let the AI guide your retention and build real mastery.
        </p>
      </motion.div>

      {/* Tags */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        {tags.map((tag, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70">
            <Check className="h-3 w-3 text-cyan-400" />
            {tag}
          </div>
        ))}
      </motion.div>

      {/* Primary Action */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        className="mt-12"
      >
        <Button variant="primary" onClick={() => setSessionOpen(true)} className="group flex items-center justify-between w-64 h-16">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 shadow-inner">
              <Focus className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[15px] font-bold">Start Session</span>
              <span className="text-[10px] font-medium text-white/70">Deep focus timer</span>
            </div>
          </div>
          <Play className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
        </Button>
      </motion.div>

      {/* Timer Modal */}
      <AnimatePresence>
        {sessionOpen ? (
          <motion.div className="fixed inset-0 z-50 bg-[#020617] backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex min-h-screen flex-col p-6 sm:p-10">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">Focus Session Active</div>
                <Button variant="outline" size="icon" onClick={() => setSessionOpen(false)} aria-label="Close session" className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid flex-1 place-items-center">
                <div className="max-w-3xl text-center">
                  <div className={`mt-8 text-7xl font-semibold tracking-tight sm:text-[9rem] tabular-nums font-serif ${timeLeft === 0 ? "text-red-400" : "text-white"}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <h2 className="mt-8 text-2xl font-medium tracking-normal text-white/80">{nextTopic.title}</h2>
                  <p className="mt-4 text-sm text-white/50">Write one insight, one question, and one example before ending.</p>
                  
                  <div className="mt-8 flex justify-center gap-4">
                    {timeLeft === 0 ? (
                      <p className="text-cyan-400 font-semibold animate-pulse">Session complete! Great work.</p>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setTimeLeft(50 * 60)} className="text-white/40 hover:text-white rounded-full">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Timer
                      </Button>
                    )}
                  </div>

                  <div className="mt-12 flex justify-center gap-4">
                    <Button variant="primary" onClick={completeSession} className="rounded-full px-8">
                      <CheckCircle2 className="h-4 w-4" />
                      {timeLeft === 0 ? "Log Session" : "End & Log Early"}
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
