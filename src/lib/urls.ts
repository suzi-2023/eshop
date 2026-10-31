import { isSortOption, type ProductQuery } from "@/lib/types";

/**
 * URL helpers for the catalog so links and the sort control build the same
 * query strings (and never leak empty params like `?q=&sort=featured`).
 */

type RawSearchParams = Record<string, string | string[] | undefined>;

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

/** Build `/products?...` from a query, omitting defaults and empty values. */
export function productsUrl(query: ProductQuery = {}) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.sort && query.sort !== "featured") params.set("sort", query.sort);

  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function productUrl(slug: string) {
  return `/products/${slug}`;
}
