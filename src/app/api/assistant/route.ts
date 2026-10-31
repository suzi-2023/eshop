import { z } from "zod";
import { streamAssistant } from "@/lib/ai/assistant";
import { aiConfig, isAiConfigured } from "@/lib/ai/config";

/**
 * POST /api/assistant
 * Body: { messages: [{ role: "user" | "assistant", content: string }, ...] }
 * Response: newline-delimited JSON stream of `AssistantEvent`s.
 *
 * The client sends plain text history; tool calls and results from earlier
 * replies are not replayed, which keeps requests small and the model honest
 * (it searches again rather than relying on stale results).
 */

// Allow streaming replies to run longer than the default serverless limit.
export const maxDuration = 60;

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(aiConfig.assistantMaxMessageChars),
      }),
    )
    .min(1)
    .max(aiConfig.assistantMaxHistory),
});

export async function POST(request: Request) {
  if (!isAiConfigured()) {
    return Response.json(
      { error: "The assistant is not enabled. Set ANTHROPIC_API_KEY on the server." },
      { status: 503 },
    );
  }

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages } = parsed.data;
  if (messages.at(-1)?.role !== "user") {
    return Response.json({ error: "The last message must be from the user." }, { status: 400 });
  }

  return new Response(streamAssistant(messages, { signal: request.signal }), {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      // Ask proxies not to buffer so tokens reach the browser as they arrive.
      "X-Accel-Buffering": "no",
    },
  });
}
