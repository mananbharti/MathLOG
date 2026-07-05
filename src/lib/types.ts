export type TopicStatus = "Not Started" | "Learning" | "Practicing" | "Done" | "Frozen";

export type Phase = {
  id: string;
  name: string;
  description: string;
  order: number;
  targetHours: number;
};

export type ReviewEvent = {
  id: string;
  topicId: string;
  date: string;
  quality: number;
  confidenceBefore: number;
  confidenceAfter: number;
  interval: number;
  easeFactor: number;
};

export type Resource = {
  id: string;
  topicId: string;
  title: string;
  type: "YouTube" | "PDF" | "Book" | "Article" | "Link";
  url: string;
  quality: number;
};

export type StudySession = {
  id: string;
  topicId: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  notes: string;
  aiQuestions: string[];
  resourcesOpened: string[];
  confidenceBefore: number;
  confidenceAfter: number;
};

export type Topic = {
  id: string;
  title: string;
  phaseId: string;
  status: TopicStatus;
  difficulty: 1 | 2 | 3 | 4 | 5;
  confidence: number;
  estimatedHours: number;
  actualHours: number;
  resources: Resource[];
  markdownNotes: string;
  tags: string[];
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  lastStudied?: string;
  nextReview?: string;
  reviewInterval: number;
  easeFactor: number;
  repetitions: number;
  reviewHistory: ReviewEvent[];
  attachments: string[];
  aiSummary: string;
  prerequisites: string[];
  dependents: string[];
  frozen: boolean;
  archived: boolean;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: "review" | "study" | "milestone";
  topicId?: string;
};

export type AISettings = {
  apiKey: string;
  model: string;
};
