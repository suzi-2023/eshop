"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, ShoppingBag, Trash2 } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { remainingForFreeShipping, shippingFor } from "@/lib/shipping";
import { productUrl } from "@/lib/urls";
import { formatPrice } from "@/lib/utils";
import { selectSubtotal, useCartStore } from "@/store/cart";
import { Button, buttonClasses } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QuantityStepper } from "@/components/product/quantity-stepper";

/** Full cart page content: line items on the left, order summary on the right. */
export function CartView() {
  const hydrated = useHydrated();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore(selectSubtotal);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // Cart state comes from localStorage; show a placeholder until it is available.
  if (!hydrated) return <CartSkeleton />;
  if (lines.length === 0) return <EmptyCart />;

  const shipping = shippingFor(subtotal);
  const remaining = remainingForFreeShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
      <ul className="divide-y divide-border">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-4 py-6 sm:gap-6">
            <Link
              href={productUrl(line.slug)}
              className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 sm:size-28"
            >
              <Image src={line.image} alt={line.name} fill sizes="112px" className="object-cover" />
            </Link>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
              <div className="min-w-0">
                <Link href={productUrl(line.slug)} className="font-medium hover:underline">
                  {line.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(line.priceCents)} each
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <QuantityStepper
                    size="sm"
                    value={line.quantity}
                    max={line.stock}
                    onChange={(qty) => setQuantity(line.productId, qty)}
                    label={`Quantity for ${line.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(line.productId)}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-danger"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Remove
                  </button>
                </div>
              </div>

              <p className="font-semibold tabular-nums sm:text-right">
                {formatPrice(line.priceCents * line.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <aside className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold">Order summary</h2>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(total)}</dd>
          </div>
        </dl>

        {remaining > 0 && (
          <p className="mt-4 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
            Add <span className="font-medium text-foreground">{formatPrice(remaining)}</span> more
            to unlock free shipping.
          </p>
        )}

        {/* Checkout is wired to a payment provider in a later step. */}
        <Button
          size="lg"
          className="mt-6 w-full"
          disabled
          title="Checkout is added in the next step"
        >
          <Lock className="size-4" aria-hidden />
          Checkout (coming soon)
        </Button>

        <Link
          href="/products"
          className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Continue shopping
          <ArrowRight className="size-4" aria-hidden />
        </Link>

        <p className="mt-6 text-xs text-muted-foreground">
          Taxes are calculated at checkout. Prices include all applicable duties.
        </p>
      </aside>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <ShoppingBag className="size-6" aria-hidden />
      </span>
      <h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>
      <p className="mt-2 max-w-sm text-muted-foreground text-pretty">
        Looks like you have not added anything yet. Browse the collection to find something you
        love.
      </p>
      <Link href="/products" className={buttonClasses({ size: "lg", className: "mt-8" })}>
        Start shopping
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]" aria-busy="true">
      <div className="divide-y divide-border">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="flex gap-6 py-6">
            <Skeleton className="size-28" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
