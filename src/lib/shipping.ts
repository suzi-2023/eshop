import { siteConfig } from "@/lib/config";

/**
 * Shipping rules. Kept separate from the cart store so the same logic can be
 * reused server-side when orders are created.
 */

export function shippingFor(subtotalCents: number) {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= siteConfig.freeShippingThresholdCents ? 0 : siteConfig.flatShippingCents;
}

/** Amount still needed to unlock free shipping (0 when already unlocked). */
export function remainingForFreeShipping(subtotalCents: number) {
  return Math.max(0, siteConfig.freeShippingThresholdCents - subtotalCents);
}
