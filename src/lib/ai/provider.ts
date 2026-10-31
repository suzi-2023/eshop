import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { APICallError, type LanguageModel } from "ai";
import { aiModelId, resolveAiProvider, type AiTask } from "@/lib/ai/config";

/**
 * Provider factory for the Vercel AI SDK.
 *
 * Everything above this layer (search, assistant) only sees a `LanguageModel`,
 * so adding another provider means adding one case here and a key to
 * `resolveAiProvider`. The provider packages read their API keys from the
 * environment themselves.
 */

/** Thrown when an AI feature is used without any provider key. */
export class AiNotConfiguredError extends Error {
  constructor() {
    super(
      "AI features are disabled: set GOOGLE_GENERATIVE_AI_API_KEY (Gemini) or ANTHROPIC_API_KEY (Claude).",
    );
    this.name = "AiNotConfiguredError";
  }
}

export function getLanguageModel(task: AiTask): LanguageModel {
  const provider = resolveAiProvider();
  if (!provider) throw new AiNotConfiguredError();

  const modelId = aiModelId(task, provider);
  switch (provider) {
    case "gemini":
      return google(modelId);
    case "claude":
      return anthropic(modelId);
  }
}

/**
 * Classify an SDK error for logging and for choosing a user-facing message.
 * Status codes are the same across providers; everything else is "unknown".
 */
export function classifyAiError(
  error: unknown,
): "auth" | "rate-limit" | "aborted" | "api" | "unknown" {
  if (error instanceof Error && error.name === "AbortError") return "aborted";
  if (APICallError.isInstance(error)) {
    if (error.statusCode === 401 || error.statusCode === 403) return "auth";
    // Google answers a bad key with 400 + "API_KEY_INVALID" instead of 401.
    if (error.statusCode === 400 && error.responseBody?.includes("API_KEY_INVALID")) return "auth";
    if (error.statusCode === 429) return "rate-limit";
    return "api";
  }
  return "unknown";
}
