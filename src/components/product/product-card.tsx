import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { productUrl } from "@/lib/urls";
import { discountPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/product/price";
import { Rating } from "@/components/product/rating";

const LOW_STOCK_THRESHOLD = 5;

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const soldOut = product.stock === 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <Link
      href={productUrl(product.slug)}
      className="group flex flex-col focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5 transition-shadow group-hover:shadow-card group-focus-visible:ring-2 group-focus-visible:ring-accent">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount && <Badge variant="inverted">-{discount}%</Badge>}
          {soldOut && <Badge variant="danger">Sold out</Badge>}
          {lowStock && <Badge variant="warning">Only {product.stock} left</Badge>}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category.name}
        </p>
        <h3 className="font-medium leading-snug underline-offset-4 group-hover:underline">
          {product.name}
        </h3>
        <Rating rating={product.rating} reviewCount={product.reviewCount} compact />
        <Price priceCents={product.priceCents} compareAtCents={product.compareAtCents} size="sm" />
      </div>
    </Link>
  );
}
