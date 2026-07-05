"use client";

import { ArrowUpRight, Brain, Clock, Flame, Leaf, RotateCcw, Sparkles, Trees } from "lucide-react";
import { useMathStore } from "@/store/use-math-store";
import { getReviewQueue, getStaleTopics } from "@/lib/spaced-repetition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { Button } from "@/components/ui/button";
import { MasteryRing } from "@/features/dashboard/mastery-ring";
import { StudyHeatmap } from "@/features/dashboard/heatmap";
import { StatusPill } from "@/components/ui/status-pill";

export function Dashboard() {
  const { topics, phases, sessions, reviewTopic, setActiveView } = useMathStore();
  const today = new Date().toISOString().slice(0, 10);
  const mastery = Math.round(topics.reduce((sum, topic) => sum + topic.confidence * 10, 0) / topics.length);
  const reviews = getReviewQueue(topics, today);
  const stale = getStaleTopics(topics, today);
  const hours = Math.round(sessions.reduce((sum, session) => sum + session.durationMinutes, 0) / 60);
  const completed = topics.filter((topic) => topic.status === "Done").length;
  const activeTopic = topics.find((topic) => topic.status !== "Done" && !topic.archived) ?? topics[0];
  const currentPhase = phases.find((phase) => phase.id === activeTopic.phaseId) ?? phases[0];
  const currentPhaseTopics = topics.filter((topic) => topic.phaseId === currentPhase.id);
  const currentPhaseProgress = currentPhaseTopics.length
    ? Math.round((currentPhaseTopics.filter((topic) => topic.status === "Done").length / currentPhaseTopics.length) * 100)
    : 0;

  // Calculate study streak
  const uniqueStudyDays = Array.from(
    new Set(sessions.map((s) => new Date(s.endTime).toISOString().slice(0, 10)))
  ).sort((a, b) => b.localeCompare(a));
  
  let streak = 0;
  let checkDate = new Date();
  
  if (uniqueStudyDays.length > 0) {
    const todayStr = checkDate.toISOString().slice(0, 10);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
    
    // Check if the streak is currently alive (studied today or yesterday)
    if (uniqueStudyDays[0] === todayStr || uniqueStudyDays[0] === yesterdayStr) {
      // Starting date for checking streak
      checkDate = new Date(uniqueStudyDays[0]);
      
      while (true) {
        const dateStr = checkDate.toISOString().slice(0, 10);
        if (uniqueStudyDays.includes(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  return (
    <div className="grid gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Study streak" value={`${streak} days`} detail={streak > 0 ? "Keep it up!" : "Start today"} />
          <Metric label="Study hours" value={`${hours}h`} detail="From tracked sessions" />
          <Metric label="Current phase" value={`Phase ${currentPhase.order}`} detail={`${currentPhaseProgress}% phase completion`} />
          <Metric label="Reviews today" value={`${reviews.length}`} detail={`${stale.length} stale topics`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Mastery Ring</CardTitle>
              <span className="text-xs text-white/35">Adaptive confidence</span>
            </CardHeader>
            <CardContent>
              <MasteryRing value={mastery} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Executive Focus</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveView("Knowledge Graph")}>
                Open graph
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/35">Weekly focus</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-normal text-white">Begin with {activeTopic.title}.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                  Your curriculum is loaded cleanly. Start tracking sessions, notes, resources, and reviews to build a real learning history.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <Brain className="h-5 w-5 text-blue-300" />
                  <div className="mt-3 text-sm font-semibold">{activeTopic.title}</div>
                  <p className="mt-1 text-xs text-white/45">Current topic</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <RotateCcw className="h-5 w-5 text-cyan-300" />
                  <div className="mt-3 text-sm font-semibold">SM-2 reviews</div>
                  <p className="mt-1 text-xs text-white/45">Due queue generated</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <Flame className="h-5 w-5 text-violet-300" />
                  <div className="mt-3 text-sm font-semibold">{completed}/{topics.length} done</div>
                  <p className="mt-1 text-xs text-white/45">Overall completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Study Heatmap</CardTitle>
              <span className="text-xs text-white/35">56 day cadence</span>
            </CardHeader>
            <CardContent>
              <StudyHeatmap />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phase Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {phases.map((phase) => {
                const phaseTopics = topics.filter((topic) => topic.phaseId === phase.id);
                const progress = phaseTopics.length
                  ? Math.round((phaseTopics.filter((topic) => topic.status === "Done").length / phaseTopics.length) * 100)
                  : 0;
                return (
                  <div key={phase.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-white/80">{phase.name}</span>
                      <span className="text-white/40">{progress}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Learning DNA</CardTitle>
              <Brain className="h-4 w-4 text-white/35" />
            </CardHeader>
            <CardContent className="space-y-4">
              {phases.slice(0, 5).map((phase) => {
                const phaseTopics = topics.filter((topic) => topic.phaseId === phase.id);
                const score = phaseTopics.length ? Math.round(phaseTopics.reduce((sum, topic) => sum + topic.confidence, 0) / phaseTopics.length) * 10 : 0;
                const label = score >= 70 ? "Strong" : score >= 40 ? "Emerging" : "Needs foundation";
                return (
                  <div key={phase.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{phase.name.replace(/^Phase \d+: /, "")}</span>
                      <span className="text-white/40">{label}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mathematical Tree</CardTitle>
              <Trees className="h-4 w-4 text-white/35" />
            </CardHeader>
            <CardContent>
              <div className="relative mx-auto h-64 max-w-sm">
                <div className="absolute bottom-0 left-1/2 h-40 w-2 -translate-x-1/2 rounded-full bg-gradient-to-t from-white/10 to-cyan-300/40" />
                {topics.slice(0, 18).map((topic, index) => {
                  const done = topic.status === "Done";
                  return (
                    <Leaf
                      key={topic.id}
                      className={`absolute h-5 w-5 ${done ? "text-emerald-300" : "text-white/20"}`}
                      style={{
                        left: `${22 + ((index * 17) % 56)}%`,
                        top: `${12 + ((index * 29) % 58)}%`,
                        transform: `rotate(${index * 31}deg)`
                      }}
                    />
                  );
                })}
                <div className="absolute bottom-4 left-1/2 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-black/35 p-3 text-center text-sm text-white/50">
                  Branches grow as topics become yours.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mastery Forecast</CardTitle>
              <Sparkles className="h-4 w-4 text-white/35" />
            </CardHeader>
            <CardContent className="space-y-4">
              {["Today", "Next Month", "Three Months", "ML Ready"].map((label, index) => {
                const width = Math.min(100, mastery + index * 14);
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm">
                      <span>{label}</span>
                      <span className="text-white/40">{width}%</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-white/10">
                      <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Reviews</CardTitle>
            <span className="text-xs text-white/35">SM-2 queue</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviews.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-white/45">
                No reviews are due yet. Reviews will appear after you study topics and grade recall.
              </div>
            ) : null}
            {reviews.map((topic) => (
              <div key={topic.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{topic.title}</div>
                    <div className="mt-1 text-xs text-white/40">Confidence {topic.confidence}/10, interval {topic.reviewInterval}d</div>
                  </div>
                  <StatusPill status={topic.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[2, 4, 5].map((quality) => (
                    <Button key={quality} variant="outline" size="sm" onClick={() => reviewTopic(topic.id, quality)}>
                      {quality === 2 ? "Forgot" : quality === 4 ? "Good" : "Easy"}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/60">
            <p>Start with {activeTopic.title} in {currentPhase.name}.</p>
            <p>Add resources and notes as you study so the AI coach can reason from your actual work.</p>
            <p>No retention or velocity recommendations will be inferred until sessions and reviews exist.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity River</CardTitle>
            <Clock className="h-4 w-4 text-white/35" />
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-white/45">
                No study sessions recorded yet.
              </div>
            ) : null}
            {sessions.map((session) => {
              const topic = topics.find((item) => item.id === session.topicId);
              return (
                <div key={session.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-cyan-300" />
                  <span className="min-w-0 flex-1">{topic?.title}</span>
                  <span className="text-white/40">{session.durationMinutes}m</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
