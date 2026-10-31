import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { isAiConfigured } from "@/lib/ai/config";

/** Thrown when an AI feature is used without `ANTHROPIC_API_KEY`. */
export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI features are disabled: set ANTHROPIC_API_KEY to enable them.");
    this.name = "AiNotConfiguredError";
  }
}

let client: Anthropic | undefined;

/**
 * Lazily constructed Anthropic client (one per server process).
 * The SDK reads `ANTHROPIC_API_KEY` from the environment itself.
 */
export function getAnthropic(): Anthropic {
  if (!isAiConfigured()) throw new AiNotConfiguredError();
  client ??= new Anthropic({
    // Storefront requests should fail fast rather than hang; the SDK retries
    // transient errors (429/5xx) once before giving up.
    maxRetries: 1,
    timeout: 45_000,
  });
  return client;
}
