"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { selectItemCount, useCartStore } from "@/store/cart";

/** Header cart icon with a live item count badge. */
export function CartButton() {
  const count = useCartStore(selectItemCount);
  // The cart lives in localStorage; hide the count until hydrated to avoid a mismatch.
  const hydrated = useHydrated();
  const showCount = hydrated && count > 0;

  return (
    <Link
      href="/cart"
      aria-label={showCount ? `Cart, ${count} items` : "Cart"}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <ShoppingBag className="size-5" aria-hidden />
      {showCount && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-accent-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
