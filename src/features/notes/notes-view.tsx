"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect, useState } from "react";
import { Bot, Sparkles, Loader2 } from "lucide-react";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NotesView() {
  const { topics, selectedTopicId, selectTopic, updateTopic } = useMathStore();
  const selected = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Typography, Placeholder.configure({ placeholder: "Capture proofs, examples, questions, and AI summaries..." })],
    content: selected.markdownNotes || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Save content back to store
      const html = editor.getHTML();
      // Basic HTML to text for simplicity here, but stores it
      const text = editor.getText();
      updateTopic(selected.id, { markdownNotes: html });
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== selected.markdownNotes) {
      editor.commands.setContent(selected.markdownNotes || "");
    }
  }, [editor, selected.id]); // Intentionally omitting selected.markdownNotes so it doesn't re-render while typing

  async function generateAITask(task: "summarize" | "quiz") {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiResponse(null);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          topicTitle: selected.title,
          topicNotes: editor?.getText() || "",
          topicTags: selected.tags,
          confidence: selected.confidence,
          prerequisites: selected.prerequisites
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setAiResponse(data.content);
      
      if (task === "summarize") {
        updateTopic(selected.id, { aiSummary: data.content });
      }
    } catch (err) {
      console.error(err);
      setAiResponse("Failed to generate content. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Topic Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topics.map((topic) => (
            <button key={topic.id} onClick={() => selectTopic(topic.id)} className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${topic.id === selected.id ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/[0.06]"}`}>
              {topic.title}
            </button>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{selected.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => generateAITask("summarize")} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Summarize
            </Button>
            <Button variant="primary" size="sm" onClick={() => generateAITask("quiz")} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
              Quiz me
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiResponse && (
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  <Bot className="h-4 w-4" />
                  AI Response
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAiResponse(null)} className="h-6 text-xs px-2">Close</Button>
              </div>
              <div className="prose prose-invert max-w-none text-sm text-cyan-50/90 whitespace-pre-wrap">
                {aiResponse}
              </div>
            </div>
          )}
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <EditorContent editor={editor} className="prose prose-invert max-w-none min-h-[460px] [&_.ProseMirror]:min-h-[430px] [&_.ProseMirror]:outline-none [&_pre]:rounded-lg [&_pre]:bg-black/45 [&_pre]:p-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
