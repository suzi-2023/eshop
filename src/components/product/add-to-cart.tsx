"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/product/quantity-stepper";

const FEEDBACK_MS = 1800;

/** Quantity picker + "Add to cart" button with brief success feedback. */
export function AddToCart({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  const soldOut = product.stock === 0;

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setAdded(false), FEEDBACK_MS);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <QuantityStepper
        value={quantity}
        onChange={setQuantity}
        max={Math.max(1, product.stock)}
        label={`Quantity for ${product.name}`}
      />
      <Button
        size="lg"
        className="flex-1"
        onClick={handleAdd}
        disabled={soldOut}
        aria-live="polite"
      >
        {soldOut ? (
          "Sold out"
        ) : added ? (
          <>
            <Check className="size-5" aria-hidden /> Added to cart
          </>
        ) : (
          <>
            <ShoppingBag className="size-5" aria-hidden /> Add to cart
          </>
        )}
      </Button>
    </div>
  );
}
