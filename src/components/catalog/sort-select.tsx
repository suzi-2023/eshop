"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SORT_OPTIONS, isSortOption, type ProductQuery } from "@/lib/types";
import { productsUrl } from "@/lib/urls";

/** Sort dropdown; changing it updates the URL so results are shareable. */
export function SortSelect({ query }: { query: ProductQuery }) {
  const router = useRouter();

  return (
    <label className="relative inline-flex items-center text-sm">
      <span className="sr-only">Sort products</span>
      <select
        value={query.sort ?? "featured"}
        onChange={(e) => {
          const sort = e.target.value;
          if (isSortOption(sort)) router.push(productsUrl({ ...query, sort }));
        }}
        className="h-10 appearance-none rounded-full border border-border bg-background pl-4 pr-9 text-sm font-medium outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 size-4 text-muted-foreground"
        aria-hidden
      />
    </label>
  );
}
