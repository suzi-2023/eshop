/**
 * Domain types used by the UI.
 *
 * They are deliberately decoupled from Prisma's generated types so components
 * don't depend on the database shape, and so the same types can be served from
 * the bundled demo catalog when no database is configured.
 */

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Price in minor units (paise / cents). */
  priceCents: number;
  /** Original price when the product is discounted, otherwise null. */
  compareAtCents: number | null;
  images: string[];
  stock: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  category: Pick<Category, "id" | "slug" | "name">;
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export function isSortOption(value: unknown): value is SortOption {
  return SORT_OPTIONS.some((o) => o.value === value);
}

export type ProductQuery = {
  /** Free-text search across name, description and tags. */
  q?: string;
  /**
   * Additional search terms, matched the same way as `q`. A product matches
   * when ANY term matches, so AI-extracted keyword lists widen the search
   * while price/category filters narrow it.
   */
  terms?: string[];
  /** Category slug. */
  category?: string;
  /** Inclusive price bounds in minor units (paise / cents). */
  minPriceCents?: number;
  maxPriceCents?: number;
  sort?: SortOption;
  limit?: number;
};
