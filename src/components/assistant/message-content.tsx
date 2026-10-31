import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders the small Markdown subset the assistant is asked to produce:
 * paragraphs, "- " bullet lists, **bold**, and [label](url) links.
 * Deliberately tiny instead of a full Markdown library: the model output is
 * constrained by the system prompt, and this avoids rendering raw HTML.
 */
export function MessageContent({ text }: { text: string }) {
  const blocks = splitBlocks(text);

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "list" ? (
          <ul key={i} className="list-disc space-y-1 pl-5">
            {block.items.map((item, j) => (
              <li key={j}>{renderInline(item)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{renderInline(block.text)}</p>
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

// Matches **bold** or [label](url); everything else is plain text.
const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      // Only same-site links are navigable; anything else renders as text.
      return href.startsWith("/") ? (
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
