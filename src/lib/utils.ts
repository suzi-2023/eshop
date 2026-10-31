import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/lib/config";

/** Merge Tailwind class names without duplicates (`cn("p-2", cond && "p-4")`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

/** Format an amount stored in minor units (paise / cents) for display. */
export function formatPrice(cents: number) {
  return priceFormatter.format(cents / 100);
}

/** Whole-number discount percentage, or null when there is no discount. */
export function discountPercent(priceCents: number, compareAtCents: number | null) {
  if (!compareAtCents || compareAtCents <= priceCents) return null;
  return Math.round(((compareAtCents - priceCents) / compareAtCents) * 100);
}

/** Turn "Wireless Headphones Pro" into "wireless-headphones-pro". */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
