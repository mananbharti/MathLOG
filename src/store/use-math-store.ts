"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calendarEvents, phases, sessions, topics } from "@/lib/seed";
import type { AISettings, CalendarEvent, Phase, Resource, StudySession, Topic, TopicStatus } from "@/lib/types";
import { calculateSM2 } from "@/lib/spaced-repetition";

type MathState = {
  phases: Phase[];
  topics: Topic[];
  sessions: StudySession[];
  calendarEvents: CalendarEvent[];
  selectedTopicId: string;
  activeView: string;
  aiSettings: AISettings;
  storageMode: "local" | "supabase-ready";
  setActiveView: (view: string) => void;
  setAISettings: (settings: Partial<AISettings>) => void;
  selectTopic: (topicId: string) => void;
  updateTopic: (topicId: string, patch: Partial<Topic>) => void;
  reviewTopic: (topicId: string, quality: number) => void;
  addSession: (session: Omit<StudySession, "id">) => void;
  addResource: (topicId: string, resource: Omit<Resource, "id" | "topicId">) => void;
  ingestResource: (input: string, topicId?: string) => void;
  setTopicStatus: (topicId: string, status: TopicStatus) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  exportJSON: () => string;
  importJSON: (payload: string) => void;
};

function detectResource(input: string): Omit<Resource, "id" | "topicId"> {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  const type = lower.includes("youtube.com") || lower.includes("youtu.be")
    ? "YouTube"
    : lower.endsWith(".pdf") || lower.includes(".pdf")
      ? "PDF"
      : lower.includes("book") || lower.includes("isbn")
        ? "Book"
        : lower.startsWith("http")
          ? "Article"
          : "Link";

  return {
    title: trimmed.replace(/^https?:\/\//, "").slice(0, 84) || "Untitled resource",
    type,
    url: lower.startsWith("http") ? trimmed : "#",
    quality: 0
  };
}

export const useMathStore = create<MathState>()(
  persist(
    (set, get) => ({
      phases,
      topics,
      sessions,
      calendarEvents,
      selectedTopicId: "sets",
      activeView: "Today",
      storageMode: "local",
      aiSettings: {
        apiKey: "",
        model: "openai/gpt-4o-mini"
      },
      setActiveView: (view) => set({ activeView: view }),
      setAISettings: (settings) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, ...settings }
        })),
      selectTopic: (topicId) => set({ selectedTopicId: topicId, activeView: "Topics" }),
      updateTopic: (topicId, patch) =>
        set((state) => ({
          topics: state.topics.map((topic) => (topic.id === topicId ? { ...topic, ...patch } : topic))
        })),
      setTopicStatus: (topicId, status) =>
        set((state) => {
          const topic = state.topics.find((t) => t.id === topicId);
          const newEvent: CalendarEvent | null =
            status === "Done" && topic
              ? {
                  id: crypto.randomUUID(),
                  title: `✅ Completed: ${topic.title}`,
                  date: new Date().toISOString().slice(0, 10),
                  type: "milestone",
                  topicId
                }
              : null;
          return {
            topics: state.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    status,
                    completedDate: status === "Done" ? new Date().toISOString().slice(0, 10) : t.completedDate
                  }
                : t
            ),
            calendarEvents: newEvent ? [...state.calendarEvents, newEvent] : state.calendarEvents
          };
        }),
      reviewTopic: (topicId, quality) =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          const updatedTopics = state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            const result = calculateSM2(topic, quality);
            return {
              ...topic,
              ...result,
              lastStudied: today,
              reviewHistory: [
                ...topic.reviewHistory,
                {
                  id: crypto.randomUUID(),
                  topicId,
                  date: today,
                  quality,
                  confidenceBefore: topic.confidence,
                  confidenceAfter: result.confidence,
                  interval: result.reviewInterval,
                  easeFactor: result.easeFactor
                }
              ]
            };
          });
          const topic = state.topics.find((t) => t.id === topicId);
          const reviewEvent: CalendarEvent = {
            id: crypto.randomUUID(),
            title: `📝 Reviewed: ${topic?.title ?? "Topic"}`,
            date: today,
            type: "review",
            topicId
          };
          return {
            topics: updatedTopics,
            calendarEvents: [...state.calendarEvents, reviewEvent]
          };
        }),
      addSession: (session) =>
        set((state) => {
          const sessionId = crypto.randomUUID();
          const sessionDate = new Date(session.endTime).toISOString().slice(0, 10);
          const topic = state.topics.find((t) => t.id === session.topicId);
          const studyEvent: CalendarEvent = {
            id: crypto.randomUUID(),
            title: `📚 Studied: ${topic?.title ?? "Topic"} (${session.durationMinutes}m)`,
            date: sessionDate,
            type: "study",
            topicId: session.topicId
          };
          return {
            sessions: [{ id: sessionId, ...session }, ...state.sessions],
            topics: state.topics.map((t) =>
              t.id === session.topicId
                ? {
                    ...t,
                    status: t.status === "Not Started" ? "Learning" : t.status,
                    actualHours: Number((t.actualHours + session.durationMinutes / 60).toFixed(2)),
                    confidence: session.confidenceAfter,
                    lastStudied: sessionDate
                  }
                : t
            ),
            calendarEvents: [...state.calendarEvents, studyEvent]
          };
        }),
      addCalendarEvent: (event) =>
        set((state) => ({
          calendarEvents: [...state.calendarEvents, { id: crypto.randomUUID(), ...event }]
        })),
      addResource: (topicId, resource) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  resources: [...topic.resources, { id: crypto.randomUUID(), topicId, ...resource }]
                }
              : topic
          )
        })),
      ingestResource: (input, topicId) => {
        const state = get();
        const chosenTopicId =
          topicId ??
          state.topics.find((topic) => input.toLowerCase().includes(topic.title.toLowerCase()))?.id ??
          state.selectedTopicId;
        get().addResource(chosenTopicId, detectResource(input));
      },
      exportJSON: () => JSON.stringify(get(), null, 2),
      importJSON: (payload) => {
        const parsed = JSON.parse(payload) as Partial<MathState>;
        set({
          phases: parsed.phases ?? phases,
          topics: parsed.topics ?? topics,
          sessions: parsed.sessions ?? sessions,
          calendarEvents: parsed.calendarEvents ?? calendarEvents
        });
      }
    }),
    {
      name: "math-os-storage",
      partialize: (state) => ({
        phases: state.phases,
        topics: state.topics,
        sessions: state.sessions,
        calendarEvents: state.calendarEvents,
        selectedTopicId: state.selectedTopicId,
        aiSettings: {
          apiKey: "",
          model: state.aiSettings.model
        }
      })
    }
  )
);
