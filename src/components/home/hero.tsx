import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

// Hero photography. Swap for brand imagery before launch.
const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    alt: "Minimal wristwatch on a neutral background",
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    alt: "Over-ear wireless headphones",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/40">
      {/* Soft radial glow behind the content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <Container className="relative grid gap-12 py-14 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="max-w-xl">
          <Badge variant="accent">
            <Sparkles className="size-3.5" aria-hidden />
            New: AI-powered search
          </Badge>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Everyday essentials, <span className="text-muted-foreground">chosen with care.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            A tightly curated catalog of audio, footwear, watches and bags. Fewer options, better
            ones, and fast delivery to your door.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className={buttonClasses({ size: "lg" })}>
              Shop the collection
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="#categories" className={buttonClasses({ size: "lg", variant: "outline" })}>
              Browse categories
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 text-sm">
            {[
              [
                "Free shipping",
                `on orders over ${formatPrice(siteConfig.freeShippingThresholdCents)}`,
              ],
              ["30-day returns", "no questions asked"],
              ["Secure checkout", "cards, UPI and wallets"],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="font-semibold">{term}</dt>
                <dd className="mt-1 text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-4 lg:max-w-none">
          {heroImages.map((image, i) => (
            <div
              key={image.src}
              className={
                i === 0
                  ? "relative aspect-[4/5] translate-y-8 overflow-hidden rounded-3xl bg-muted shadow-card ring-1 ring-black/5"
                  : "relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted shadow-card ring-1 ring-black/5"
              }
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
