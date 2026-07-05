import { addDays } from "@/lib/utils";
import type { Topic } from "@/lib/types";

export type ReviewResult = {
  repetitions: number;
  reviewInterval: number;
  easeFactor: number;
  nextReview: string;
  confidence: number;
};

export function calculateSM2(topic: Topic, quality: number, date = new Date().toISOString().slice(0, 10)): ReviewResult {
  const clampedQuality = Math.max(0, Math.min(5, quality));
  let repetitions = topic.repetitions;
  let interval = topic.reviewInterval || 0;
  let easeFactor = topic.easeFactor || 2.5;

  if (clampedQuality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - clampedQuality) * (0.08 + (5 - clampedQuality) * 0.02))
  );

  const confidenceDelta = clampedQuality >= 4 ? 1 : clampedQuality === 3 ? 0 : -2;

  return {
    repetitions,
    reviewInterval: interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReview: addDays(date, interval),
    confidence: Math.max(1, Math.min(10, topic.confidence + confidenceDelta))
  };
}

export function getReviewQueue(topics: Topic[], today = new Date().toISOString().slice(0, 10)) {
  return topics
    .filter((topic) => !topic.archived && !topic.frozen && topic.nextReview && topic.nextReview <= today)
    .sort((a, b) => {
      const dateDelta = new Date(a.nextReview || today).getTime() - new Date(b.nextReview || today).getTime();
      return dateDelta || a.confidence - b.confidence;
    });
}

export function getStaleTopics(topics: Topic[], today = new Date().toISOString().slice(0, 10)) {
  return topics.filter((topic) => {
    if (!topic.lastStudied || topic.status === "Done" || topic.frozen || topic.archived) return false;
    const daysIdle = (new Date(today).getTime() - new Date(topic.lastStudied).getTime()) / 86_400_000;
    return daysIdle > Math.max(10, topic.reviewInterval * 1.5);
  });
}
