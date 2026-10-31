import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product/product-card";

const gridClasses = "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4 lg:gap-x-6";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className={gridClasses}>
      {products.map((product, index) => (
        <li key={product.id}>
          {/* Eagerly load the first row of images; they are above the fold. */}
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}

/** Placeholder grid shown while products stream in. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={gridClasses} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}
