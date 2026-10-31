import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components ("use cache" + partial prerendering) is left off for now so
  // database reads in server components stay simple. Turn it on once the catalog
  // queries in `src/lib/catalog.ts` are tagged with `cacheTag` / `cacheLife`.
  cacheComponents: false,

  images: {
    // Product photos are hosted on Unsplash in the demo catalog. Add your own
    // image host (Cloudinary, Supabase Storage, ...) here before going live.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
