import { isAiConfigured } from "@/lib/ai/config";
import { interpretSearch } from "@/lib/ai/search";
import { getProducts } from "@/lib/catalog";

/**
 * GET /api/search?q=<natural language query>
 *
 * JSON version of the AI search used by the products page, handy for a
 * mobile app or for debugging what the model understood:
 * { interpretation: { summary, source }, products: Product[] }
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return Response.json({ error: "Missing q parameter." }, { status: 400 });

  if (!isAiConfigured()) {
    return Response.json(
      { error: "AI search is not enabled. Set ANTHROPIC_API_KEY on the server." },
      { status: 503 },
    );
  }

  const interpretation = await interpretSearch(q);
  const products = await getProducts(interpretation.query);

  return Response.json(
    {
      interpretation: { summary: interpretation.summary, source: interpretation.source },
      products,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
