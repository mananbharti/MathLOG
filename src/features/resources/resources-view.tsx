"use client";

import { BookOpen, FileText, Link2, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const icons = {
  PDF: FileText,
  YouTube: PlayCircle,
  Book: BookOpen,
  Article: Link2,
  Link: Link2
};

export function ResourcesView() {
  const { topics, ingestResource, selectedTopicId } = useMathStore();
  const [input, setInput] = useState("");
  const library = topics.flatMap((topic) => topic.resources.map((resource) => ({ ...resource, topic: topic.title })));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Resource Library</CardTitle>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (!input.trim()) return;
              ingestResource(input, selectedTopicId);
              setInput("");
            }}
          >
            Add resource
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2 rounded-lg border border-white/10 bg-black/25 p-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-24 w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              placeholder="Paste any resource you used: YouTube URL, PDF link, book title, article, or notes. The app classifies it and attaches it to the selected topic."
            />
          </div>
          {library.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-white/45 sm:col-span-2">
              No resources added yet.
            </div>
          ) : null}
          {library.map((resource) => {
            const Icon = icons[resource.type as keyof typeof icons];
            return (
              <div key={resource.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <Icon className="h-5 w-5 text-blue-300" />
                <h3 className="mt-4 font-semibold">{resource.title}</h3>
                <p className="mt-2 text-sm text-white/45">{resource.type} for {resource.topic}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-white/40">
                  <span>Quality {resource.quality}%</span>
                  <a href={resource.url} target="_blank" rel="noreferrer">Open</a>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topics.slice(0, 8).map((topic) => (
            <div key={topic.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm">
              <span>{topic.title}</span>
              <span className="text-white/40">{topic.resources.length} refs</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
