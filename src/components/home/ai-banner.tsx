import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const examplePrompts = [
  "Noise-cancelling headphones under ₹15,000",
  "A gift for someone who runs every morning",
  "Something to carry a 14-inch laptop on a bike",
];

/**
 * Preview of the AI shopping assistant. Static for now; it becomes a live chat
 * once the Claude API route is added.
 */
export function AiBanner() {
  return (
    <section className="overflow-hidden rounded-3xl bg-primary text-primary-foreground">
      <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge className="bg-white/10 text-white">
            <Sparkles className="size-3.5" aria-hidden />
            Coming next
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Shop by describing what you need.
          </h2>
          <p className="mt-4 max-w-prose text-primary-foreground/70 text-pretty">
            Our assistant understands budgets, use cases and preferences, then recommends products
            from the catalog with honest trade-offs. No keyword guessing required.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <div className="rounded-xl bg-background px-4 py-3 text-sm text-muted-foreground">
            Ask anything, e.g. &ldquo;{examplePrompts[0]}&rdquo;
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {examplePrompts.map((prompt) => (
              <li
                key={prompt}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-primary-foreground/80"
              >
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
