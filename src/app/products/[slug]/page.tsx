import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";
import { productsUrl } from "@/lib/urls";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { AddToCart } from "@/components/product/add-to-cart";
import { Price } from "@/components/product/price";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { Rating } from "@/components/product/rating";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { images: [{ url: product.images[0], alt: product.name }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const inStock = product.stock > 0;

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: productsUrl() },
          { label: product.category.name, href: productsUrl({ category: product.category.slug }) },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <Link
            href={productsUrl({ category: product.category.slug })}
            className="text-xs font-semibold uppercase tracking-widest text-accent hover:underline"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
            {inStock ? (
              <Badge variant="success">In stock</Badge>
            ) : (
              <Badge variant="danger">Sold out</Badge>
            )}
          </div>

          <Price
            priceCents={product.priceCents}
            compareAtCents={product.compareAtCents}
            size="lg"
            className="mt-6"
          />
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes.</p>

          <p className="mt-6 leading-relaxed text-muted-foreground text-pretty">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          {/* Trust signals */}
          <ul className="mt-8 grid gap-3 rounded-2xl border border-border bg-muted/40 p-5 text-sm sm:grid-cols-3">
            {[
              {
                icon: Truck,
                text: `Free delivery over ${formatPrice(siteConfig.freeShippingThresholdCents)}`,
              },
              { icon: RotateCcw, text: "30-day easy returns" },
              { icon: ShieldCheck, text: "1-year warranty included" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0 text-accent" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {product.tags.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold">Highlights</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <li key={tag}>
                    <Link href={productsUrl({ q: tag })}>
                      <Badge className="capitalize hover:bg-border/70">{tag}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 lg:mt-28" aria-labelledby="related-heading">
          <SectionHeading
            title="You may also like"
            description={`More from ${product.category.name}.`}
            href={productsUrl({ category: product.category.slug })}
          />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </Container>
  );
}
