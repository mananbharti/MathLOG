import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as {
    messages?: { role: string; content: string }[];
    context?: unknown;
    model?: string;
    /** Legacy single-prompt mode (still supported) */
    prompt?: string;
  };

  // Build the conversation array
  let conversationMessages: { role: string; content: string }[];

  if (body.messages && body.messages.length > 0) {
    // Multi-turn mode — client sends full history
    conversationMessages = body.messages;
  } else if (body.prompt?.trim()) {
    // Legacy single-prompt mode
    conversationMessages = [
      {
        role: "user",
        content: JSON.stringify(
          { prompt: body.prompt, context: body.context },
          null,
          2
        )
      }
    ];
  } else {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  // Build the system message with learner context
  const systemMessage = {
    role: "system",
    content: `You are the MATH.OS AI mentor. Give concise, actionable mathematics learning guidance. Use the structured learner context and avoid inventing progress that is not present.

Format your responses with clear structure: use bullet points, numbered lists, headings (with **bold**), and code blocks for formulas when helpful. Keep responses focused and practical.

LEARNER CONTEXT:
${JSON.stringify(body.context, null, 2)}`
  };

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
      messages: [systemMessage, ...conversationMessages]
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
