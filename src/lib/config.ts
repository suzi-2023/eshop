/**
 * Site-wide constants. Change these in one place.
 */
export const siteConfig = {
  name: "eShop",
  tagline: "Thoughtfully curated essentials, delivered fast.",
  description: "A modern e-commerce storefront with AI-powered search and recommendations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** ISO 4217 currency code and the locale used to format prices. */
  currency: "INR",
  locale: "en-IN",
  /** Orders at or above this subtotal (in minor units) ship free. */
  freeShippingThresholdCents: 99900,
  flatShippingCents: 9900,
  nav: [
    { href: "/products", label: "Shop all" },
    { href: "/products?category=electronics", label: "Electronics" },
    { href: "/products?category=footwear", label: "Footwear" },
    { href: "/products?category=watches", label: "Watches" },
    { href: "/products?category=bags", label: "Bags" },
  ],
} as const;
