/**
 * Types shared between the assistant API route and the chat UI.
 * No server-only imports here: the client bundle uses these too.
 */

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

/** Compact product shape the assistant returns for rendering cards. */
export type AssistantProduct = {
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  url: string;
};

/**
 * Events streamed from `/api/assistant` as newline-delimited JSON.
 * Order: zero or more `text`, optionally one `products`, then `done`
 * (or `error` at any point, which also ends the stream).
 */
export type AssistantEvent =
  | { type: "text"; text: string }
  | { type: "products"; products: AssistantProduct[] }
  | { type: "error"; message: string }
  | { type: "done" };
