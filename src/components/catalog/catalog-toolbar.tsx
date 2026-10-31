import Link from "next/link";
import type { Category } from "@/lib/types";
import { productsUrl, type ProductsUrlOptions } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { SortSelect } from "@/components/catalog/sort-select";

/**
 * Category filter chips + sort control shown above the product grid.
 * `query` carries the current URL state (including the AI flag) so every
 * link preserves the shopper's other choices.
 */
export function CatalogToolbar({
  categories,
  query,
}: {
  categories: Category[];
  query: ProductsUrlOptions;
}) {
  const chips = [{ slug: undefined, name: "All" }, ...categories];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Horizontal scroll on small screens instead of wrapping. */}
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => {
          const active = (query.category ?? undefined) === chip.slug;
          return (
            <li key={chip.slug ?? "all"} className="shrink-0">
              <Link
                href={productsUrl({ ...query, category: chip.slug })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
              >
                {chip.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <SortSelect query={query} />
    </div>
  );
}
