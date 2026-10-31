import { isSortOption, type ProductQuery } from "@/lib/types";

/**
 * URL helpers for the catalog so links and the sort control build the same
 * query strings (and never leak empty params like `?q=&sort=featured`).
 */

type RawSearchParams = Record<string, string | string[] | undefined>;

/** Catalog query plus the UI-only `ai` flag (AI-interpreted search on/off). */
export type ProductsUrlOptions = ProductQuery & { ai?: boolean };

/** First value of a search param, ignoring repeated keys. */
function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Validate raw `searchParams` from a page into a typed `ProductQuery`. */
export function parseProductQuery(params: RawSearchParams): ProductQuery {
  const q = first(params.q)?.trim();
  const category = first(params.category)?.trim();
  const sort = first(params.sort);

  return {
    q: q || undefined,
    category: category || undefined,
    sort: isSortOption(sort) ? sort : undefined,
  };
}

/** `?ai=1` asks the products page to interpret `q` with the AI search. */
export function parseAiFlag(params: RawSearchParams): boolean {
  return first(params.ai) === "1";
}

/** Build `/products?...` from a query, omitting defaults and empty values. */
export function productsUrl(options: ProductsUrlOptions = {}) {
  const params = new URLSearchParams();
  if (options.q) params.set("q", options.q);
  if (options.category) params.set("category", options.category);
  if (options.sort && options.sort !== "featured") params.set("sort", options.sort);
  // The AI flag only means something together with a query.
  if (options.ai && options.q) params.set("ai", "1");

  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function productUrl(slug: string) {
  return `/products/${slug}`;
}
