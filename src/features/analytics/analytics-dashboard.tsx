"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { MasteryRing } from "@/features/dashboard/mastery-ring";

export function AnalyticsDashboard() {
  const { topics, phases, sessions } = useMathStore();
  const mastery = Math.round(topics.reduce((sum, topic) => sum + topic.confidence * 10, 0) / topics.length);
  const totalMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const averageSession = sessions.length ? Math.round(totalMinutes / sessions.length) : 0;
  const completed = topics.filter((topic) => topic.status === "Done").length;
  const reviewedTopics = topics.filter((topic) => topic.reviewHistory.length > 0);
  const successfulReviews = reviewedTopics.flatMap((topic) => topic.reviewHistory).filter((review) => review.quality >= 3).length;
  const totalReviews = reviewedTopics.reduce((sum, topic) => sum + topic.reviewHistory.length, 0);
  const retention = totalReviews ? Math.round((successfulReviews / totalReviews) * 100) : 0;
  const weekly = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({ day, hours: 0 }));
  const cumulative = [
    { week: "W1", hours: 0, mastery },
    { week: "W2", hours: 0, mastery },
    { week: "W3", hours: 0, mastery },
    { week: "W4", hours: 0, mastery }
  ];
  const radar = phases.map((phase) => {
    const phaseTopics = topics.filter((topic) => topic.phaseId === phase.id);
    const score = phaseTopics.length ? Math.round(phaseTopics.reduce((sum, topic) => sum + topic.confidence, 0) / phaseTopics.length) : 0;
    return { phase: phase.name.replace("Linear Algebra", "Linear"), score };
  });

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Productivity" value="0" detail="Requires study sessions" />
        <Metric label="Velocity" value={`${completed} topics`} detail="Completed topics" />
        <Metric label="Retention" value={`${retention}%`} detail="From review history" />
        <Metric label="Avg session" value={`${averageSession}m`} detail="Tracked sessions" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Mastery</CardTitle>
          </CardHeader>
          <CardContent>
            <MasteryRing value={mastery} />
          </CardContent>
        </Card>
        <ChartCard title="Weekly Study Hours">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekly}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.35)" />
              <YAxis stroke="rgba(255,255,255,0.35)" />
              <Tooltip contentStyle={{ background: "#0d1017", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]} fill="url(#barGradient)" />
              <defs>
                <linearGradient id="barGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="55%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Confidence Radar">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radar}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="phase" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
              <Radar dataKey="score" stroke="#60a5fa" fill="#8b5cf6" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Cumulative Learning">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cumulative}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.35)" />
              <YAxis stroke="rgba(255,255,255,0.35)" />
              <Area type="monotone" dataKey="hours" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Retention Graph">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cumulative}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.35)" />
              <YAxis stroke="rgba(255,255,255,0.35)" />
              <Line type="monotone" dataKey="mastery" stroke="#a78bfa" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/55">
            <p>No monthly report has been generated yet.</p>
            <p>Completion predictions will appear after sessions, reviews, and completed topics exist.</p>
            <p>PDF export can use this same report surface once real report data is available.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
