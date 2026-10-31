/**
 * AI feature settings.
 *
 * Model choice is deliberately cost-conscious because the Claude API is the
 * only pay-as-you-go part of the stack:
 * - Search interpretation is a tiny extraction task, so it runs on Haiku.
 * - The assistant writes customer-facing recommendations, so it runs on Sonnet.
 * Override either with an env var (e.g. `AI_ASSISTANT_MODEL=claude-opus-5-5`)
 * when quality matters more than cost. Keep this file free of `server-only`
 * so the pure constants can be imported anywhere; secrets are never read here
 * except through `isAiConfigured()`, which is only meaningful on the server.
 */
export const aiConfig = {
  searchModel: process.env.AI_SEARCH_MODEL ?? "claude-haiku-5-5",
  assistantModel: process.env.AI_ASSISTANT_MODEL ?? "claude-sonnet-5-5",

  /** Hard cap on tokens generated per assistant reply (cost + latency guard). */
  assistantMaxTokens: 1024,
  /** Max API round-trips per reply: initial answer + tool calls. */
  assistantMaxIterations: 4,
  /** Only the most recent turns are sent back to the model. */
  assistantMaxHistory: 12,
  assistantMaxMessageChars: 2000,
  /** Products handed to the model per catalog lookup. */
  assistantToolResultLimit: 6,

  searchMaxTokens: 512,
  searchMaxQueryChars: 300,
} as const;

/** True when an API key is present. Call on the server only. */
export function isAiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
