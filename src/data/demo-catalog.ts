/**
 * Demo catalog.
 *
 * Used in two places:
 * 1. `prisma/seed.ts` loads it into the database.
 * 2. `src/lib/catalog.ts` serves it directly when `DATABASE_URL` is not set,
 *    so the storefront runs out of the box.
 *
 * Images are Unsplash photos; replace them with your own product photography.
 */

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export type DemoCategory = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type DemoProduct = {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  compareAtCents?: number;
  images: string[];
  stock: number;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  categorySlug: string;
};

export const demoCategories: DemoCategory[] = [
  {
    slug: "electronics",
    name: "Electronics",
    description: "Audio, cameras and everyday tech that earns its place.",
    image: img("1505740420928-5e560c06d30e"),
  },
  {
    slug: "footwear",
    name: "Footwear",
    description: "Sneakers and shoes built for long days.",
    image: img("1542291026-7eec264c27ff"),
  },
  {
    slug: "watches",
    name: "Watches",
    description: "Timeless pieces for the wrist.",
    image: img("1523275335684-37898b6baf30"),
  },
  {
    slug: "bags",
    name: "Bags",
    description: "Carry everything, beautifully.",
    image: img("1553062407-98eeb64c6a62"),
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    description: "Apparel, eyewear and fragrance for daily rituals.",
    image: img("1572635196237-14b3f281503f"),
  },
];

export const demoProducts: DemoProduct[] = [
  // ---- Electronics -------------------------------------------------------
  {
    slug: "aria-wireless-headphones",
    name: "Aria Wireless Headphones",
    description:
      "Over-ear headphones with adaptive noise cancelling, 40-hour battery life and plush memory-foam ear cushions. Pairs with two devices at once so you can move between laptop and phone without missing a beat.",
    priceCents: 1299900,
    compareAtCents: 1599900,
    images: [img("1505740420928-5e560c06d30e"), img("1583394838336-acd977736f90")],
    stock: 42,
    featured: true,
    rating: 4.8,
    reviewCount: 1284,
    tags: ["audio", "wireless", "noise-cancelling", "bluetooth"],
    categorySlug: "electronics",
  },
  {
    slug: "studio-monitor-headphones",
    name: "Studio Monitor Headphones",
    description:
      "Closed-back reference headphones tuned for a flat, honest response. A detachable coiled cable and swivelling ear cups make them a natural fit for the desk or the studio.",
    priceCents: 899900,
    images: [img("1583394838336-acd977736f90")],
    stock: 18,
    rating: 4.6,
    reviewCount: 412,
    tags: ["audio", "wired", "studio"],
    categorySlug: "electronics",
  },
  {
    slug: "lumen-mirrorless-camera",
    name: "Lumen Mirrorless Camera",
    description:
      "A compact 24MP mirrorless body with in-body stabilisation, 4K video and a bright electronic viewfinder. Ships with a versatile 18-55mm kit lens.",
    priceCents: 7499900,
    images: [img("1526170375885-4d8ecf77b99f")],
    stock: 7,
    featured: true,
    rating: 4.7,
    reviewCount: 236,
    tags: ["camera", "photography", "4k"],
    categorySlug: "electronics",
  },
  {
    slug: "slate-ultrabook-14",
    name: "Slate Ultrabook 14",
    description:
      "A 1.2kg aluminium laptop with a 14-inch 2.8K display, all-day battery and a quiet fanless design. Ideal for writing, browsing and light creative work.",
    priceCents: 8999900,
    compareAtCents: 9999900,
    images: [img("1593642632823-8f785ba67e45")],
    stock: 12,
    rating: 4.5,
    reviewCount: 189,
    tags: ["laptop", "ultrabook", "work"],
    categorySlug: "electronics",
  },
  {
    slug: "pulse-smartphone",
    name: "Pulse Smartphone",
    description:
      "A 6.1-inch OLED phone with a 50MP main camera, two-day battery life and five years of software updates. Available in graphite.",
    priceCents: 4999900,
    images: [img("1511707171634-5f897ff02aa9")],
    stock: 25,
    rating: 4.4,
    reviewCount: 958,
    tags: ["phone", "smartphone", "oled"],
    categorySlug: "electronics",
  },
  {
    slug: "echo-portable-speaker",
    name: "Echo Portable Speaker",
    description:
      "A palm-sized Bluetooth speaker with surprisingly deep bass, IP67 water resistance and 12 hours of playtime. Pair two for stereo.",
    priceCents: 599900,
    images: [img("1608043152269-423dbba4e7e1"), img("1507764923504-cd90bf7da772")],
    stock: 60,
    rating: 4.3,
    reviewCount: 2210,
    tags: ["audio", "speaker", "bluetooth", "outdoor"],
    categorySlug: "electronics",
  },

  // ---- Footwear ----------------------------------------------------------
  {
    slug: "velocity-running-shoe",
    name: "Velocity Running Shoe",
    description:
      "A responsive daily trainer with a breathable knit upper and a nitrogen-infused foam midsole. Light enough for tempo days, cushioned enough for long runs.",
    priceCents: 849900,
    compareAtCents: 999900,
    images: [img("1542291026-7eec264c27ff"), img("1600185365926-3a2ce3cdb9eb")],
    stock: 34,
    featured: true,
    rating: 4.7,
    reviewCount: 764,
    tags: ["running", "sneakers", "sport"],
    categorySlug: "footwear",
  },
  {
    slug: "court-classic-sneaker",
    name: "Court Classic Sneaker",
    description:
      "A clean, low-profile leather sneaker with a cupsole and tonal stitching. Goes with everything.",
    priceCents: 649900,
    images: [img("1600185365926-3a2ce3cdb9eb")],
    stock: 50,
    rating: 4.5,
    reviewCount: 530,
    tags: ["sneakers", "leather", "casual"],
    categorySlug: "footwear",
  },
  {
    slug: "trail-grip-hiker",
    name: "Trail Grip Hiker",
    description:
      "Waterproof hiking shoes with an aggressive lugged outsole and a padded collar for ankle support on uneven ground.",
    priceCents: 1099900,
    images: [img("1491553895911-0055eca6402d")],
    stock: 16,
    rating: 4.6,
    reviewCount: 211,
    tags: ["hiking", "outdoor", "waterproof"],
    categorySlug: "footwear",
  },
  {
    slug: "street-high-top",
    name: "Street High-Top",
    description:
      "Leather high-tops with a padded collar, perforated toe box and a cupsole built for daily wear. A streetwear staple in a classic red-and-black colourway.",
    priceCents: 449900,
    images: [img("1552346154-21d32810aba3"), img("1618366712010-f4ae9c647dcb")],
    stock: 72,
    rating: 4.2,
    reviewCount: 1403,
    tags: ["sneakers", "canvas", "streetwear"],
    categorySlug: "footwear",
  },
  {
    slug: "ember-retro-runner",
    name: "Ember Retro Runner",
    description:
      "A heritage silhouette reissued in suede and mesh with a gum sole. Comfortable all-day wear with a vintage look.",
    priceCents: 749900,
    images: [img("1543508282-6319a3e2621f")],
    stock: 21,
    rating: 4.4,
    reviewCount: 318,
    tags: ["sneakers", "retro", "suede"],
    categorySlug: "footwear",
  },

  // ---- Watches -----------------------------------------------------------
  {
    slug: "meridian-chronograph",
    name: "Meridian Chronograph",
    description:
      "A 40mm stainless-steel chronograph with a sapphire crystal, luminous hands and a quick-release leather strap. Water resistant to 100m.",
    priceCents: 2499900,
    compareAtCents: 2899900,
    images: [img("1523275335684-37898b6baf30"), img("1539874754764-5a96559165b0")],
    stock: 9,
    featured: true,
    rating: 4.9,
    reviewCount: 142,
    tags: ["watch", "chronograph", "leather", "steel"],
    categorySlug: "watches",
  },
  {
    slug: "minimal-field-watch",
    name: "Minimal Field Watch",
    description:
      "A 38mm field watch with a matte dial, high-contrast numerals and a durable nylon strap. Simple, legible and light.",
    priceCents: 899900,
    images: [img("1508057198894-247b23fe5ade")],
    stock: 27,
    rating: 4.6,
    reviewCount: 388,
    tags: ["watch", "field", "nylon"],
    categorySlug: "watches",
  },
  {
    slug: "aurora-automatic",
    name: "Aurora Automatic",
    description:
      "An in-house automatic movement visible through an exhibition case back, paired with a brushed steel bracelet and a smoked bronze sunray dial.",
    priceCents: 4299900,
    images: [img("1547996160-81dfa63595aa"), img("1524592094714-0f0654e20314")],
    stock: 5,
    rating: 4.8,
    reviewCount: 97,
    tags: ["watch", "automatic", "dress"],
    categorySlug: "watches",
  },

  // ---- Bags --------------------------------------------------------------
  {
    slug: "commuter-backpack-20l",
    name: "Commuter Backpack 20L",
    description:
      "A weatherproof 20-litre backpack with a padded 16-inch laptop sleeve, hidden back pocket and a luggage pass-through for travel days.",
    priceCents: 699900,
    images: [img("1553062407-98eeb64c6a62")],
    stock: 38,
    featured: true,
    rating: 4.7,
    reviewCount: 652,
    tags: ["backpack", "laptop", "travel", "waterproof"],
    categorySlug: "bags",
  },
  {
    slug: "structured-leather-handbag",
    name: "Structured Leather Handbag",
    description:
      "A structured top-handle bag in smooth full-grain leather with a brass turn-lock, suede lining and a detachable shoulder strap. Develops a rich patina over time.",
    priceCents: 1599900,
    images: [img("1584917865442-de89df76afd3"), img("1590874103328-eac38a683ce7")],
    stock: 14,
    rating: 4.8,
    reviewCount: 203,
    tags: ["handbag", "leather", "evening"],
    categorySlug: "bags",
  },
  {
    slug: "trailhead-canvas-rucksack",
    name: "Trailhead Canvas Rucksack",
    description:
      "A waxed canvas rucksack with full-grain leather trim, a roll-top closure and a padded laptop sleeve. Equally at home on a hike or a weekend away.",
    priceCents: 1299900,
    images: [img("1547949003-9792a18a2601"), img("1491637639811-60e2756cc1c7")],
    stock: 11,
    rating: 4.5,
    reviewCount: 158,
    tags: ["rucksack", "travel", "canvas", "outdoor"],
    categorySlug: "bags",
  },

  // ---- Lifestyle ---------------------------------------------------------
  {
    slug: "horizon-sunglasses",
    name: "Horizon Sunglasses",
    description:
      "Polarised lenses in a lightweight acetate frame with spring hinges. Includes a hard case and microfibre cloth.",
    priceCents: 549900,
    compareAtCents: 699900,
    images: [img("1572635196237-14b3f281503f"), img("1527864550417-7fd91fc51a46")],
    stock: 45,
    featured: true,
    rating: 4.6,
    reviewCount: 487,
    tags: ["sunglasses", "polarised", "eyewear"],
    categorySlug: "lifestyle",
  },
  {
    slug: "essential-cotton-tee",
    name: "Essential Cotton Tee",
    description:
      "A heavyweight organic cotton tee with a relaxed fit and a reinforced collar that holds its shape wash after wash.",
    priceCents: 149900,
    images: [img("1521572163474-6864f9cf17ab"), img("1556228453-efd6c1ff04f6")],
    stock: 120,
    rating: 4.4,
    reviewCount: 2015,
    tags: ["apparel", "t-shirt", "cotton", "organic"],
    categorySlug: "lifestyle",
  },
  {
    slug: "noir-eau-de-parfum",
    name: "Noir Eau de Parfum",
    description:
      "A warm, woody fragrance with notes of black pepper, cedar and amber. 50ml bottle, long-lasting sillage.",
    priceCents: 399900,
    images: [img("1585386959984-a4155224a1ad")],
    stock: 33,
    rating: 4.7,
    reviewCount: 329,
    tags: ["fragrance", "perfume", "unisex"],
    categorySlug: "lifestyle",
  },
];
