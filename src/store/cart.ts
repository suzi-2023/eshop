"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

/**
 * Client-side shopping cart.
 *
 * Persisted to localStorage so it survives reloads. Only the fields needed to
 * render the cart are stored, not the full product. When auth lands, sync this
 * with the `Cart` table (see prisma/schema.prisma) on sign-in.
 */

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  quantity: number;
  /** Used to cap the quantity stepper. */
  stock: number;
};

type CartState = {
  lines: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id
                  ? { ...l, quantity: Math.min(l.quantity + quantity, l.stock) }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                image: product.images[0],
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
              },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity: Math.min(quantity, l.stock) } : l,
                ),
        })),

      clear: () => set({ lines: [] }),
    }),
    { name: "eshop-cart", version: 1 },
  ),
);

// ---- Derived selectors (keep components free of arithmetic) ----------------

export const selectItemCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const selectSubtotal = (s: CartState) =>
  s.lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
