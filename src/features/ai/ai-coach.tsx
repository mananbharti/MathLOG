"use client";

import { Bot, Send, Sparkles, Trash2, Lightbulb } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { buildAIContext } from "@/lib/ai-context";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AICoach() {
  const { topics, sessions, aiSettings } = useMathStore();
  const firstTopic = topics.find((topic) => topic.status !== "Done" && !topic.archived) ?? topics[0];
  
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "Coach",
      content:
        "Your curriculum is loaded. I can create a study plan, quiz, resource checklist, or review strategy from your actual learning state."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const context = useMemo(() => buildAIContext(topics, sessions), [topics, sessions]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions = [
    `Create a study plan for ${firstTopic.title}`,
    `Quiz me on ${firstTopic.title}`,
    "Explain how to review effectively",
    "What are my weakest areas?"
  ];

  async function sendPrompt(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    const userPrompt = text.trim();
    setPrompt("");
    
    // Add user message to UI immediately
    const updatedMessages = [...messages, { role: "You", content: userPrompt }];
    setMessages(updatedMessages);

    try {
      // Map UI roles to OpenRouter roles (system/user/assistant)
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.role === "You" ? "user" : "assistant",
        content: msg.content
      }));

      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          context,
          model: aiSettings.model
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed.");
      
      setMessages((current) => [...current, { role: "Coach", content: data.content }]);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "AI request failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>AI Coach</CardTitle>
            <span className="text-xs text-white/35">{aiSettings.model}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setMessages([{ role: "Coach", content: "Conversation cleared. How can I help?" }])}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div ref={scrollRef} className="scrollbar-soft max-h-[420px] min-h-[300px] space-y-3 overflow-auto pr-2">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`max-w-2xl rounded-lg border border-white/10 p-4 ${message.role === "You" ? "bg-white/[0.08] ml-auto" : "bg-white/[0.035]"}`}>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {message.role === "Coach" ? <Bot className="h-4 w-4 text-cyan-300" /> : <div className="h-4 w-4 rounded-full bg-violet-400" />}
                    {message.role}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/80">{message.content}</p>
                </div>
              ))}
              {loading && (
                <div className="max-w-2xl rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Bot className="h-4 w-4 text-cyan-300" />
                    Coach
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-white/50">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  </div>
                </div>
              )}
            </div>
            
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((suggestion, i) => (
                  <button 
                    key={i} 
                    onClick={() => sendPrompt(suggestion)}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Lightbulb className="h-3 w-3" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-lg border border-white/10 bg-black/25 p-3 focus-within:border-white/20 focus-within:bg-black/40 transition-colors">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                    event.preventDefault();
                    void sendPrompt(prompt);
                  }
                }}
                className="min-h-[80px] w-full resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-white/35"
                placeholder="Ask about a concept, request practice problems, or generate a weekly review..."
              />
              {error ? <p className="border-t border-white/10 pt-3 text-sm text-red-300">{error}</p> : null}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-xs text-white/35">Rich structured context attached. Ctrl Enter sends.</span>
                <Button variant="primary" size="sm" onClick={() => void sendPrompt(prompt)} disabled={loading || !prompt.trim()}>
                  <Send className="h-4 w-4" />
                  {loading ? "Thinking" : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Context Payload</CardTitle>
          <Sparkles className="h-4 w-4 text-violet-300" />
        </CardHeader>
        <CardContent>
          <pre className="scrollbar-soft max-h-[620px] overflow-auto rounded-lg border border-white/10 bg-black/30 p-4 text-xs leading-5 text-white/55">
            {JSON.stringify(context, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
