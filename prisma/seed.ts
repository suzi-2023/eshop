/**
 * Seed script: loads the demo catalog into the database.
 *
 * Run with `npm run db:seed` (requires DATABASE_URL). Safe to re-run: every
 * record is upserted by slug, so existing rows are updated rather than duplicated.
 */
import { PrismaClient } from "@prisma/client";
import { demoCategories, demoProducts } from "../src/data/demo-catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories...");
  const categoryIdBySlug = new Map<string, string>();

  for (const category of demoCategories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryIdBySlug.set(row.slug, row.id);
  }

  console.log("Seeding products...");
  for (const { categorySlug, ...product } of demoProducts) {
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) {
      throw new Error(`Unknown category "${categorySlug}" for product "${product.slug}"`);
    }

    const data = { ...product, featured: product.featured ?? false, categoryId };
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
    });
  }

  console.log(`Done: ${demoCategories.length} categories, ${demoProducts.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
