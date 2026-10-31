/**
 * AI feature settings and provider selection.
 *
 * Two providers are supported out of the box, selected by which API key is
 * present (or forced with `AI_PROVIDER`):
 *
 *   gemini  -> GOOGLE_GENERATIVE_AI_API_KEY   (has a free tier; good for starting out)
 *   claude  -> ANTHROPIC_API_KEY              (pay as you go)
 *
 * Model choice is cost-conscious: a small fast model for search interpretation
 * (a tiny extraction task) and a mid-tier model for the customer-facing
 * assistant. Override either with `AI_SEARCH_MODEL` / `AI_ASSISTANT_MODEL`.
 *
 * Keep this file free of `server-only` so the pure constants can be imported
 * anywhere; the env lookups are only meaningful on the server.
 */

export type AiProvider = "gemini" | "claude";
export type AiTask = "search" | "assistant";

const defaultModels: Record<AiProvider, Record<AiTask, string>> = {
  gemini: { search: "gemini-3.5-flash-lite", assistant: "gemini-3.5-flash" },
  claude: { search: "claude-haiku-5-5", assistant: "claude-sonnet-5-5" },
};

export const aiConfig = {
  /** Hard cap on tokens generated per assistant reply (cost + latency guard). */
  assistantMaxTokens: 1024,
  /** Max model round-trips per reply: initial answer + tool calls. */
  assistantMaxSteps: 4,
  /** Only the most recent turns are sent back to the model. */
  assistantMaxHistory: 12,
  assistantMaxMessageChars: 2000,
  /** Products handed to the model per catalog lookup. */
  assistantToolResultLimit: 6,

  searchMaxTokens: 512,
  searchMaxQueryChars: 300,
  /** Abort a search interpretation that takes longer than this. */
  searchTimeoutMs: 20_000,
} as const;

const hasGeminiKey = () => Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const hasClaudeKey = () => Boolean(process.env.ANTHROPIC_API_KEY);

/**
 * Which provider to use, or null when no usable key is configured.
 * `AI_PROVIDER` forces one; otherwise the first provider with a key wins,
 * Gemini first because of its free tier.
 */
export function resolveAiProvider(): AiProvider | null {
  const requested = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (requested === "gemini" || requested === "google") return hasGeminiKey() ? "gemini" : null;
  if (requested === "claude" || requested === "anthropic") return hasClaudeKey() ? "claude" : null;
  if (hasGeminiKey()) return "gemini";
  if (hasClaudeKey()) return "claude";
  return null;
}

/** True when an AI provider is usable. Call on the server only. */
export function isAiConfigured() {
  return resolveAiProvider() !== null;
}

/** Model id for a task on the active provider, honouring env overrides. */
export function aiModelId(task: AiTask, provider: AiProvider): string {
  const override = task === "search" ? process.env.AI_SEARCH_MODEL : process.env.AI_ASSISTANT_MODEL;
  return override?.trim() || defaultModels[provider][task];
}
