import "server-only";
import { z } from "zod";
import type { AssistantProduct } from "@/lib/ai/types";
import { SORT_OPTIONS, type Category, type Product, type ProductQuery } from "@/lib/types";
import { productUrl } from "@/lib/urls";
import { formatPrice } from "@/lib/utils";

/**
 * The structured "catalog filter" the model produces, shared by AI search
 * (structured output) and the assistant's `search_catalog` tool.
 *
 * Prices are expressed in whole rupees because that is how shoppers phrase
 * them; `filterToQuery` converts to paise for the catalog layer. Fields are
 * nullable rather than optional because structured outputs require every
 * property to be present.
 */
export function buildCatalogFilterSchema(categories: Category[]) {
  const slugs = categories.map((c) => c.slug);
  const categoryList = categories.map((c) => `${c.slug} (${c.name})`).join(", ");

  return z.object({
    terms: z
      .array(z.string())
      .max(6)
      .describe(
        "1-4 short lowercase keywords likely to appear in product names, descriptions or tags " +
          "(e.g. 'headphones', 'running', 'leather'). Avoid generic words such as 'gift', " +
          "'something', 'good', 'best'. Use an empty array to match everything.",
      ),
    category: z
      .enum(slugs as [string, ...string[]])
      .nullable()
      .describe(`Category slug when clearly implied, otherwise null. Options: ${categoryList}.`),
    min_price_inr: z.number().nullable().describe("Minimum price in rupees, or null."),
    max_price_inr: z.number().nullable().describe("Maximum price in rupees, or null."),
    sort: z
      .enum(SORT_OPTIONS.map((o) => o.value) as [string, ...string[]])
      .nullable()
      .describe(
        "Sort order when the shopper asks for it ('cheapest' -> price-asc, 'best rated' -> rating), otherwise null.",
      ),
  });
}

export type CatalogFilter = z.infer<ReturnType<typeof buildCatalogFilterSchema>>;

/** Convert the model's filter into a catalog query (rupees -> paise). */
export function filterToQuery(filter: CatalogFilter, limit?: number): ProductQuery {
  const toPaise = (inr: number | null) =>
    inr !== null && Number.isFinite(inr) && inr > 0 ? Math.round(inr * 100) : undefined;

  const sort = SORT_OPTIONS.find((o) => o.value === filter.sort)?.value;

  return {
    terms: filter.terms.map((t) => t.trim().toLowerCase()).filter(Boolean),
    category: filter.category ?? undefined,
    minPriceCents: toPaise(filter.min_price_inr),
    maxPriceCents: toPaise(filter.max_price_inr),
    sort,
    limit,
  };
}

/** Human-readable description of the filters, shown above AI search results. */
export function describeFilter(filter: CatalogFilter, categories: Category[]): string[] {
  const parts: string[] = [];
  if (filter.terms.length > 0) parts.push(filter.terms.join(", "));
  const category = categories.find((c) => c.slug === filter.category);
  if (category) parts.push(`in ${category.name}`);
  if (filter.min_price_inr !== null && filter.max_price_inr !== null) {
    parts.push(
      `${formatPrice(filter.min_price_inr * 100)} - ${formatPrice(filter.max_price_inr * 100)}`,
    );
  } else if (filter.max_price_inr !== null) {
    parts.push(`under ${formatPrice(filter.max_price_inr * 100)}`);
  } else if (filter.min_price_inr !== null) {
    parts.push(`over ${formatPrice(filter.min_price_inr * 100)}`);
  }
  const sort = SORT_OPTIONS.find((o) => o.value === filter.sort);
  if (sort && sort.value !== "featured") parts.push(sort.label.toLowerCase());
  return parts;
}

/**
 * Compact product record given to the model. Keeps tool results small (cost)
 * and includes the exact URL so links in the answer are never invented.
 */
export function productForModel(product: Product) {
  return {
    name: product.name,
    url: productUrl(product.slug),
    category: product.category.name,
    price: formatPrice(product.priceCents),
    was_price: product.compareAtCents ? formatPrice(product.compareAtCents) : undefined,
    rating: `${product.rating.toFixed(1)}/5 (${product.reviewCount} reviews)`,
    in_stock: product.stock > 0,
    highlights: product.tags,
    summary:
      product.description.length > 180
        ? `${product.description.slice(0, 177)}...`
        : product.description,
  };
}

/** Product shape sent to the chat UI for rendering cards. */
export function productForUi(product: Product): AssistantProduct {
  return {
    slug: product.slug,
    name: product.name,
    priceCents: product.priceCents,
    image: product.images[0],
    url: productUrl(product.slug),
  };
}
