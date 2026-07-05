import type { StudySession, Topic } from "@/lib/types";
import { getReviewQueue, getStaleTopics } from "@/lib/spaced-repetition";

export function buildAIContext(topics: Topic[], sessions: StudySession[]) {
  const today = new Date().toISOString().slice(0, 10);
  const completedTopics = topics.filter((topic) => topic.status === "Done");
  const weakTopics = topics.filter((topic) => topic.confidence <= 5 && !topic.archived);
  const reviewsDue = getReviewQueue(topics, today);
  const staleTopics = getStaleTopics(topics, today);

  return {
    generatedAt: new Date().toISOString(),
    learnerState: {
      totalTopics: topics.length,
      completedTopics: completedTopics.map((topic) => topic.title),
      weakTopics: weakTopics.map((topic) => ({
        title: topic.title,
        confidence: topic.confidence,
        blockers: topic.prerequisites,
        nextReview: topic.nextReview,
        notes: topic.markdownNotes,
        aiSummary: topic.aiSummary
      })),
      reviewsDue: reviewsDue.map((topic) => ({
        title: topic.title,
        interval: topic.reviewInterval,
        easeFactor: topic.easeFactor,
        repetitions: topic.repetitions,
        reviewHistory: topic.reviewHistory
      })),
      staleTopics: staleTopics.map((topic) => topic.title)
    },
    topicGraph: topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      phaseId: topic.phaseId,
      confidence: topic.confidence,
      status: topic.status,
      prerequisites: topic.prerequisites,
      dependents: topic.dependents,
      tags: topic.tags,
      notes: topic.markdownNotes,
      resources: topic.resources
    })),
    sessions: sessions.map((session) => ({
      topicId: session.topicId,
      durationMinutes: session.durationMinutes,
      notes: session.notes,
      aiQuestions: session.aiQuestions,
      confidenceBefore: session.confidenceBefore,
      confidenceAfter: session.confidenceAfter
    }))
  };
}
