"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AssistantEvent, AssistantProduct, ChatMessage } from "@/lib/ai/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MessageContent } from "@/components/assistant/message-content";

/**
 * Chat panel for the shopping assistant.
 *
 * Sends the text history to `/api/assistant` and renders the NDJSON event
 * stream as it arrives. Product cards appear under the reply once the model
 * has finished. When `enabled` is false (no API key on the server) the panel
 * stays visible as a preview but cannot send.
 */

type Turn = ChatMessage & { products?: AssistantProduct[]; error?: string };

const MAX_INPUT_CHARS = 500;

export function AssistantPanel({
  enabled,
  examplePrompts,
}: {
  enabled: boolean;
  examplePrompts: string[];
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view while streaming.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [turns]);

  // Cancel an in-flight request if the panel unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_INPUT_CHARS);
    if (!content || busy || !enabled) return;

    const history: ChatMessage[] = [
      ...turns.filter((t) => !t.error).map(({ role, content }) => ({ role, content })),
      { role: "user", content },
    ];

    setTurns([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    // Update the last (assistant) turn in place as events arrive.
    const patchReply = (patch: (turn: Turn) => Turn) =>
      setTurns((prev) => prev.map((t, i) => (i === prev.length - 1 ? patch(t) : t)));

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `Request failed (${response.status})`);
      }

      for await (const event of readEvents(response.body)) {
        switch (event.type) {
          case "text":
            patchReply((t) => ({ ...t, content: t.content + event.text }));
            break;
          case "products":
            patchReply((t) => ({ ...t, products: event.products }));
            break;
          case "error":
            patchReply((t) => ({ ...t, error: event.message }));
            break;
          case "done":
            break;
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const message = error instanceof Error ? error.message : "Something went wrong.";
        patchReply((t) => ({ ...t, error: message }));
      }
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  const hasConversation = turns.length > 0;

  return (
    <section
      aria-labelledby="assistant-heading"
      className="overflow-hidden rounded-3xl bg-primary text-primary-foreground"
    >
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-12">
        {/* Intro column */}
        <div>
          <Badge className="bg-white/10 text-white">
            <Sparkles className="size-3.5" aria-hidden />
            {enabled ? "Beta" : "Preview"}
          </Badge>
          <h2
            id="assistant-heading"
            className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Shop by describing what you need.
          </h2>
          <p className="mt-4 max-w-prose text-primary-foreground/70 text-pretty">
            Tell the assistant your budget, use case or who it is for. It searches the catalog and
            recommends products with honest trade-offs, never anything we do not stock.
          </p>
          {!enabled && (
            <p className="mt-4 text-xs text-primary-foreground/60">
              Add a Gemini key (
              <code className="rounded bg-white/10 px-1 py-0.5">GOOGLE_GENERATIVE_AI_API_KEY</code>)
              or a Claude key (
              <code className="rounded bg-white/10 px-1 py-0.5">ANTHROPIC_API_KEY</code>) to the
              server environment to turn the assistant on.
            </p>
          )}
        </div>

        {/* Chat column */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5">
          <div
            ref={logRef}
            className="flex max-h-[26rem] min-h-[14rem] flex-col gap-4 overflow-y-auto p-4 sm:p-5"
            aria-live="polite"
          >
            {!hasConversation ? (
              <div className="my-auto">
                <p className="text-sm text-primary-foreground/60">Try asking</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {examplePrompts.map((prompt) => (
                    <li key={prompt}>
                      <button
                        type="button"
                        disabled={!enabled || busy}
                        onClick={() => void send(prompt)}
                        className="rounded-full border border-white/15 px-3 py-1.5 text-left text-xs text-primary-foreground/80 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {prompt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              turns.map((turn, i) => (
                <TurnView key={i} turn={turn} streaming={busy && i === turns.length - 1} />
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-1.5 text-foreground">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_INPUT_CHARS}
                disabled={!enabled || busy}
                placeholder={
                  enabled ? `Ask anything, e.g. "${examplePrompts[0]}"` : "Assistant not configured"
                }
                aria-label="Message the shopping assistant"
                className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!enabled || busy || input.trim().length === 0}
                aria-label="Send"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowUp className="size-4" aria-hidden />
                )}
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-primary-foreground/50">
              AI can make mistakes. Check the product page before you buy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function TurnView({ turn, streaming }: { turn: Turn; streaming: boolean }) {
  if (turn.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/15 px-4 py-2.5 text-sm">
        {turn.content}
      </div>
    );
  }

  const waiting = streaming && turn.content === "";

  return (
    <div className="max-w-[95%] space-y-3">
      <div className="rounded-2xl rounded-bl-md bg-background px-4 py-3 text-foreground">
        {waiting ? (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Searching the catalog
          </span>
        ) : (
          <MessageContent text={turn.content} products={turn.products} />
        )}
        {turn.error && <p className="mt-2 text-sm text-danger">{turn.error}</p>}
      </div>

      {turn.products && turn.products.length > 0 && (
        <ul className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {turn.products.map((product) => (
            <li key={product.slug} className="shrink-0">
              <Link
                href={product.url}
                className={cn(
                  "flex w-44 gap-3 rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10",
                )}
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 text-xs font-medium leading-snug">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-xs text-primary-foreground/70">
                    {formatPrice(product.priceCents)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Parse a newline-delimited JSON body into typed events as chunks arrive. */
async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<AssistantEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newline: number;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) yield JSON.parse(line) as AssistantEvent;
    }
  }
  if (buffer.trim()) yield JSON.parse(buffer) as AssistantEvent;
}
