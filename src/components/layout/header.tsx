import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/layout/cart-button";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchForm } from "@/components/layout/search-form";

/**
 * Site header: announcement bar + sticky navigation.
 * Server component; the interactive pieces (menu, search, cart) are client islands.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <p className="bg-primary py-2 text-center text-xs font-medium tracking-wide text-primary-foreground">
        Free shipping on orders over {formatPrice(siteConfig.freeShippingThresholdCents)} &middot;
        Easy 30-day returns
      </p>

      <Container className="flex h-16 items-center gap-2 sm:gap-4">
        <MobileMenu />
        <Logo />

        <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs md:block">
          {/* useSearchParams inside SearchForm needs a Suspense boundary. */}
          <Suspense>
            <SearchForm />
          </Suspense>
        </div>

        <div className="ml-auto md:ml-0">
          <CartButton />
        </div>
      </Container>
    </header>
  );
}
