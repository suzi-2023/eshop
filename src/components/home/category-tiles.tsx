import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { productsUrl } from "@/lib/urls";

/** Image tiles linking to each category. */
export function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={productsUrl({ category: category.slug })}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {category.image && (
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            )}
            {/* Gradient keeps the label readable on any photo. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              {category.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-white/80">{category.description}</p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
