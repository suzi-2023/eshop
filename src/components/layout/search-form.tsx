"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { productsUrl } from "@/lib/urls";
import { cn } from "@/lib/utils";

/**
 * Product search box. Submitting navigates to `/products?q=...`.
 *
 * When `aiEnabled` is true a sparkle toggle appears inside the field. With it
 * on, the query is sent with `ai=1` and the products page asks Claude to turn
 * the sentence into filters ("headphones under 15k" -> category + price cap).
 * Off, it is a plain keyword match. The toggle defaults to on because the
 * interpretation call is cheap and plain keywords still work through it.
 *
 * Reads `useSearchParams`, so render it inside a `<Suspense>` boundary.
 */
export function SearchForm({
  className,
  aiEnabled = false,
  onSubmitted,
}: {
  className?: string;
  aiEnabled?: boolean;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("q") ?? "";
  // Mirror the URL when it already carries a query, otherwise prefer AI mode.
  const [useAi, setUseAi] = useState(aiEnabled && (current ? params.get("ai") === "1" : true));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q")?.toString().trim();
    router.push(productsUrl({ q: q || undefined, ai: useAi }));
    onSubmitted?.();
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        // Re-mount when the URL query changes so the field reflects it.
        key={current}
        name="q"
        type="search"
        defaultValue={current}
        placeholder={useAi ? "Describe what you need" : "Search products"}
        aria-label="Search products"
        autoComplete="off"
        className={cn(
          "h-10 w-full rounded-full border border-border bg-muted/60 pl-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:bg-background focus:ring-2 focus:ring-accent/20",
          aiEnabled ? "pr-11" : "pr-4",
        )}
      />
      {aiEnabled && (
        <button
          type="button"
          onClick={() => setUseAi((v) => !v)}
          aria-pressed={useAi}
          aria-label={useAi ? "AI search on" : "AI search off"}
          title={useAi ? "AI search on: describe what you need" : "AI search off: exact keywords"}
          className={cn(
            "absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full transition-colors",
            useAi
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "text-muted-foreground hover:bg-border/70 hover:text-foreground",
          )}
        >
          <Sparkles className="size-3.5" aria-hidden />
        </button>
      )}
    </form>
  );
}
