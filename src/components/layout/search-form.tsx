"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { FormEvent } from "react";
import { productsUrl } from "@/lib/urls";
import { cn } from "@/lib/utils";

/**
 * Product search box. Submitting navigates to `/products?q=...`.
 * Reads `useSearchParams`, so render it inside a `<Suspense>` boundary.
 */
export function SearchForm({
  className,
  onSubmitted,
}: {
  className?: string;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const current = useSearchParams().get("q") ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q")?.toString().trim();
    router.push(productsUrl({ q: q || undefined }));
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
        placeholder="Search products"
        aria-label="Search products"
        autoComplete="off"
        className="h-10 w-full rounded-full border border-border bg-muted/60 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:bg-background focus:ring-2 focus:ring-accent/20"
      />
    </form>
  );
}
