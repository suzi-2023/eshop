import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { productsUrl } from "@/lib/urls";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { AiBanner } from "@/components/home/ai-banner";
import { CategoryTiles } from "@/components/home/category-tiles";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { ProductGrid } from "@/components/product/product-grid";

export default async function HomePage() {
  // Both reads are independent, so run them in parallel.
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts(8)]);

  return (
    <>
      <Hero />

      <Container className="space-y-20 py-16 lg:space-y-24 lg:py-20">
        <section aria-labelledby="value-props">
          <h2 id="value-props" className="sr-only">
            Why shop with us
          </h2>
          <ValueProps />
        </section>

        <section id="categories" aria-labelledby="categories-heading" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Categories"
            title="Shop by category"
            description="Five focused collections, each edited down to the pieces worth owning."
            href={productsUrl()}
            hrefLabel="Shop everything"
          />
          <div className="mt-8">
            <CategoryTiles categories={categories} />
          </div>
        </section>

        <section aria-labelledby="featured-heading">
          <SectionHeading
            eyebrow="Featured"
            title="This week's picks"
            description="Hand-selected favourites from across the catalog."
            href={productsUrl({ sort: "featured" })}
          />
          <div className="mt-8">
            <ProductGrid products={featured} />
          </div>
        </section>

        <AiBanner />
      </Container>
    </>
  );
}
