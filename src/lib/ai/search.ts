import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import {
  buildCatalogFilterSchema,
  describeFilter,
  filterToQuery,
  type CatalogFilter,
} from "@/lib/ai/catalog-filter";
import { getAnthropic } from "@/lib/ai/client";
import { aiConfig } from "@/lib/ai/config";
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
    const client = getAnthropic();
    const response = await client.messages.parse({
      model: aiConfig.searchModel,
      max_tokens: aiConfig.searchMaxTokens,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: query }],
      // Pure extraction: the lowest effort is plenty and keeps latency down.
      output_config: { effort: "low", format: zodOutputFormat(schema) },
    });

    // Safety classifiers can decline a request; treat it like any other miss.
    if (response.stop_reason === "refusal" || !response.parsed_output) return fallback;

    const filter: CatalogFilter = response.parsed_output;
    return {
      query: filterToQuery(filter),
      summary: describeFilter(filter, categories),
      source: "ai",
    };
  } catch (error) {
    // Degrade to keyword search rather than failing the page. Typed errors
    // let us tell configuration problems from transient ones in the logs.
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("[ai-search] invalid ANTHROPIC_API_KEY");
    } else if (error instanceof Anthropic.RateLimitError) {
      console.warn("[ai-search] rate limited, falling back to keyword search");
    } else if (error instanceof Anthropic.APIError) {
      console.error(`[ai-search] API error ${error.status}: ${error.message}`);
    } else {
      console.error("[ai-search] unexpected error", error);
    }
    return fallback;
  }
}
