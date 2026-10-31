import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/catalog";
import type { ProductQuery } from "@/lib/types";
import { parseProductQuery, productsUrl } from "@/lib/urls";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = parseProductQuery(await searchParams);
  if (query.q) return { title: `Search: ${query.q}` };
  if (query.category) {
    const categories = await getCategories();
    const category = categories.find((c) => c.slug === query.category);
    if (category) return { title: category.name, description: category.description ?? undefined };
  }
  return { title: "Shop all products" };
}

export default async function ProductsPage({ searchParams }: Props) {
  const query = parseProductQuery(await searchParams);
  const categories = await getCategories();

  // An unknown category slug in the URL is treated as "no filter".
  const category = categories.find((c) => c.slug === query.category);
  if (query.category && !category) query.category = undefined;

  const title = category?.name ?? (query.q ? `Results for “${query.q}”` : "All products");
  const description =
    category?.description ??
    (query.q
      ? "Matching products across every category."
      : "Everything in the catalog, in one place.");

  return (
    <Container className="py-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Shop</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-muted-foreground text-pretty">{description}</p>
      </header>

      <div className="mt-8">
        <CatalogToolbar categories={categories} query={query} />
      </div>

      <div className="mt-8">
        {/* Keyed so the skeleton shows again when filters change. */}
        <Suspense key={productsUrl(query)} fallback={<ProductGridSkeleton />}>
          <ProductResults query={query} />
        </Suspense>
      </div>
    </Container>
  );
}

/** Streams in separately from the page shell. */
async function ProductResults({ query }: { query: ProductQuery }) {
  const products = await getProducts(query);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold">No products found</h2>
        <p className="mt-2 max-w-sm text-muted-foreground text-pretty">
          Try a different search term or clear the filters to see the whole catalog.
        </p>
        <Link
          href={productsUrl()}
          className={buttonClasses({ variant: "outline", className: "mt-8" })}
        >
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>
      <ProductGrid products={products} />
    </>
  );
}
