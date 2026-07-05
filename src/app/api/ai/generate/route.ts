import { NextResponse } from "next/server";

type GenerateBody = {
  task: "summarize" | "quiz" | "explain" | "ai-summary";
  topicTitle: string;
  topicNotes?: string;
  topicTags?: string[];
  confidence?: number;
  prerequisites?: string[];
  model?: string;
};

const taskPrompts: Record<string, (body: GenerateBody) => string> = {
  summarize: (body) =>
    `Summarize these study notes for the topic "${body.topicTitle}" into a clear, concise summary (3-5 bullet points). Focus on key concepts, formulas, and relationships.\n\nNotes:\n${body.topicNotes || "(No notes yet — provide a foundational summary of this topic.)"}`,

  quiz: (body) =>
    `Generate 5 practice questions for the topic "${body.topicTitle}" (confidence: ${body.confidence ?? 1}/10). Include a mix of:
- 2 conceptual questions
- 2 calculation/application questions  
- 1 challenging question that connects to prerequisites (${(body.prerequisites ?? []).join(", ") || "none"})

Format each question with:
**Q1:** [question]
**Answer:** [concise answer]

Notes context:\n${body.topicNotes || "(No notes available)"}`,

  explain: (body) =>
    `Explain the mathematical concept "${body.topicTitle}" step by step, as if teaching a student. Include:
1. **What it is** — a clear definition
2. **Why it matters** — real-world or ML applications
3. **Core formula/theorem** — written clearly
4. **Worked example** — one concrete example with steps
5. **Common mistakes** — pitfalls to avoid

Keep it focused and visual. Use mathematical notation where appropriate.`,

  "ai-summary": (body) =>
    `Write a 2-3 sentence AI learning summary for the math topic "${body.topicTitle}". It should capture what the topic covers, its difficulty level (confidence: ${body.confidence ?? 1}/10), and how it connects to the learner's path. Tags: ${(body.topicTags ?? []).join(", ")}.`
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as GenerateBody;

  if (!body.task || !body.topicTitle) {
    return NextResponse.json(
      { error: "Both 'task' and 'topicTitle' are required." },
      { status: 400 }
    );
  }

  const promptBuilder = taskPrompts[body.task];
  if (!promptBuilder) {
    return NextResponse.json(
      { error: `Unknown task: ${body.task}` },
      { status: 400 }
    );
  }

  const userPrompt = promptBuilder(body);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://math-os.local",
      "X-Title": "MATH.OS"
    },
    body: JSON.stringify({
      model: body.model || process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are MATH.OS, an AI mathematics tutor. Give clear, precise, and actionable responses. Use mathematical notation, bullet points, and structured formatting."
        },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: `OpenRouter request failed: ${text}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? "No response returned.";

  return NextResponse.json({ content });
}
