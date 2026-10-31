import Link from "next/link";
import type { ReactNode } from "react";
import type { AssistantProduct } from "@/lib/ai/types";

/**
 * Renders the small Markdown subset the assistant is asked to produce:
 * paragraphs, "- " bullet lists, **bold**, and [label](url) links.
 * Deliberately tiny instead of a full Markdown library: the model output is
 * constrained by the system prompt, and this avoids rendering raw HTML.
 *
 * Smaller models sometimes garble link targets ("(url)" or "(url: /x)"), so
 * when `products` is known a link is resolved by its label as well.
 */
export function MessageContent({
  text,
  products = [],
}: {
  text: string;
  products?: AssistantProduct[];
}) {
  const blocks = splitBlocks(text);
  const byName = new Map(products.map((p) => [p.name.toLowerCase(), p.url]));

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "list" ? (
          <ul key={i} className="list-disc space-y-1 pl-5">
            {block.items.map((item, j) => (
              <li key={j}>{renderInline(item, byName)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{renderInline(block.text, byName)}</p>
        ),
      )}
    </div>
  );
}

type Block = { type: "paragraph"; text: string } | { type: "list"; items: string[] };

/** Group lines into paragraphs and bullet lists. */
function splitBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "list", items: list });
    list = [];
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
    } else if (line === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

// Matches **bold** or [label](target); everything else is plain text.
const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]*\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]*)\)$/;

/**
 * Turn a link target into a same-site path, or null if it cannot be trusted.
 * Accepts "/products/x", "url: /products/x" and, via `byName`, a label that
 * matches a known product when the target itself is unusable.
 */
function resolveHref(label: string, rawTarget: string, byName: Map<string, string>) {
  const target = rawTarget.replace(/^url:\s*/i, "").trim();
  if (target.startsWith("/")) return target;
  return byName.get(label.trim().toLowerCase()) ?? null;
}

function renderInline(text: string, byName: Map<string, string>): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(LINK);
    if (link) {
      const [, label, target] = link;
      const href = resolveHref(label, target, byName);
      // Only same-site links are navigable; anything else renders as text.
      return href ? (
        <Link
          key={i}
          href={href}
          className="font-medium underline underline-offset-4 hover:text-accent"
        >
          {label}
        </Link>
      ) : (
        <span key={i}>{label}</span>
      );
    }
    return part;
  });
}
