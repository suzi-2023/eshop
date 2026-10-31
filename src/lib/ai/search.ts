import "server-only";
import { Output, generateText } from "ai";
import {
  buildCatalogFilterSchema,
  describeFilter,
  filterToQuery,
  type CatalogFilter,
} from "@/lib/ai/catalog-filter";
import { aiConfig } from "@/lib/ai/config";
import { classifyAiError, getLanguageModel } from "@/lib/ai/provider";
import { getCategories } from "@/lib/catalog";
import type { ProductQuery } from "@/lib/types";

/**
 * Natural-language product search.
 *
 * The model never sees the catalog here; it only translates the shopper's
 * sentence into a structured filter (keywords, category, price range, sort)
 * which the normal catalog query then executes. That keeps the call cheap,
 * deterministic to debug, and impossible to "hallucinate" products with.
 */

export type SearchInterpretation = {
  /** Filters to run through `getProducts`. */
  query: ProductQuery;
  /** Short chips describing what was understood, e.g. ["headphones", "under ₹15,000"]. */
  summary: string[];
  /** `fallback` means the AI was unavailable and `query` is a plain keyword search. */
  source: "ai" | "fallback";
};

const SYSTEM_PROMPT = `You convert a shopper's request into search filters for an online store that sells electronics, footwear, watches, bags and lifestyle goods. Prices are in Indian rupees (INR).

Rules:
- Pick 1-4 concrete keywords a product listing would actually contain. Prefer product types and attributes ("headphones", "running", "leather", "waterproof") over the shopper's framing ("gift", "something nice", "for my dad").
- For gift or persona requests, infer the product type from the recipient's interests (a runner -> "running", "sneakers").
- Only set a category when the request clearly points to one.
- Convert phrases like "under 15k", "below 15,000", "around 10000" into a rupee bound (treat "around X" as max 1.25x).
- Set sort only when asked ("cheapest", "top rated", "newest").
- Never invent constraints the shopper did not express.`;

export async function interpretSearch(rawQuery: string): Promise<SearchInterpretation> {
  const query = rawQuery.trim().slice(0, aiConfig.searchMaxQueryChars);
  const fallback: SearchInterpretation = {
    query: { q: query },
    summary: [query],
    source: "fallback",
  };
  if (!query) return fallback;

  const categories = await getCategories();
  const schema = buildCatalogFilterSchema(categories);

  try {
    const result = await generateText({
      model: getLanguageModel("search"),
      system: SYSTEM_PROMPT,
      prompt: query,
      output: Output.object({ schema }),
      maxOutputTokens: aiConfig.searchMaxTokens,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(aiConfig.searchTimeoutMs),
    });

    // A safety filter can decline the request; treat it like any other miss.
    if (result.finishReason === "content-filter") return fallback;

    // `output` is validated against the schema (throws if the model's JSON
    // did not match), so the filter is safe to use as-is.
    const filter: CatalogFilter = result.output;
    return {
      query: filterToQuery(filter),
      summary: describeFilter(filter, categories),
      source: "ai",
    };
  } catch (error) {
    // Degrade to keyword search rather than failing the page.
    switch (classifyAiError(error)) {
      case "auth":
        console.error("[ai-search] provider rejected the API key");
        break;
      case "rate-limit":
        console.warn("[ai-search] rate limited, falling back to keyword search");
        break;
      case "aborted":
        console.warn("[ai-search] timed out, falling back to keyword search");
        break;
      default:
        console.error("[ai-search] failed, falling back to keyword search", error);
    }
    return fallback;
  }
}
