import "server-only";
import type { Prisma } from "@prisma/client";
import { demoCategories, demoProducts } from "@/data/demo-catalog";
import type { Category, Product, ProductQuery, SortOption } from "@/lib/types";

/**
 * Catalog data access.
 *
 * All product/category reads go through this module so pages never talk to
 * Prisma directly. When `DATABASE_URL` is set, data comes from Postgres;
 * otherwise the bundled demo catalog is served so the UI works immediately
 * after `npm install`.
 *
 * Later: add `"use cache"` + `cacheTag("catalog")` here and revalidate the tag
 * from the admin so product pages become static-by-default.
 */

const hasDatabase = Boolean(process.env.DATABASE_URL);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  if (!hasDatabase) return demo.categories();
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return rows.map(toCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  if (!hasDatabase) return demo.products(query);

  const { prisma } = await import("@/lib/prisma");
  const where: Prisma.ProductWhereInput = {};

  if (query.category) where.category = { slug: query.category };
  if (query.q?.trim()) {
    const q = query.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { tags: { has: q.toLowerCase() } },
    ];
  }

  const rows = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: prismaOrderBy(query.sort ?? "featured"),
    take: query.limit,
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts({ sort: "featured" });
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasDatabase) return demo.productBySlug(slug);
  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return row ? toProduct(row) : null;
}

/** Other products from the same category, excluding the current one. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts({ category: product.category.slug, sort: "rating" });
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}

// ---------------------------------------------------------------------------
// Prisma helpers
// ---------------------------------------------------------------------------

type ProductRow = Prisma.ProductGetPayload<{ include: { category: true } }>;
type CategoryRow = Prisma.CategoryGetPayload<Record<string, never>>;

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
  };
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceCents: row.priceCents,
    compareAtCents: row.compareAtCents,
    images: row.images,
    stock: row.stock,
    featured: row.featured,
    rating: row.rating,
    reviewCount: row.reviewCount,
    tags: row.tags,
    category: { id: row.category.id, slug: row.category.slug, name: row.category.name },
  };
}

function prismaOrderBy(sort: SortOption): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ priceCents: "asc" }];
    case "price-desc":
      return [{ priceCents: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "rating":
      return [{ rating: "desc" }, { reviewCount: "desc" }];
    case "featured":
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

// ---------------------------------------------------------------------------
// Demo catalog (no database)
// ---------------------------------------------------------------------------

/** Product plus its position in the demo list, used to emulate "newest". */
type DemoRow = Product & { order: number };

/** Drop the internal `order` field before handing a row to the UI. */
function stripOrder(row: DemoRow): Product {
  const product: Product & { order?: number } = { ...row };
  delete product.order;
  return product;
}

const demo = {
  categories(): Category[] {
    return demoCategories.map((c) => ({ id: `cat_${c.slug}`, ...c }));
  },

  rows(): DemoRow[] {
    const categoryBySlug = new Map(this.categories().map((c) => [c.slug, c]));
    return demoProducts.map((p, order) => {
      const category = categoryBySlug.get(p.categorySlug);
      if (!category) throw new Error(`Demo product "${p.slug}" has unknown category`);
      return {
        id: `prod_${p.slug}`,
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? null,
        images: p.images,
        stock: p.stock,
        featured: p.featured ?? false,
        rating: p.rating,
        reviewCount: p.reviewCount,
        tags: p.tags,
        category: { id: category.id, slug: category.slug, name: category.name },
        order,
      };
    });
  },

  products(query: ProductQuery): Product[] {
    let list = this.rows();

    if (query.category) list = list.filter((p) => p.category.slug === query.category);
    if (query.q?.trim()) {
      const q = query.q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }

    const sort = query.sort ?? "featured";
    list.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.priceCents - b.priceCents;
        case "price-desc":
          return b.priceCents - a.priceCents;
        case "newest":
          return b.order - a.order;
        case "rating":
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        default:
          return Number(b.featured) - Number(a.featured) || a.order - b.order;
      }
    });

    if (query.limit) list = list.slice(0, query.limit);
    return list.map(stripOrder);
  },

  productBySlug(slug: string): Product | null {
    return this.products({}).find((p) => p.slug === slug) ?? null;
  },
};
