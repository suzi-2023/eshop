"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Suspense, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/lib/config";
import { Logo } from "@/components/layout/logo";
import { SearchForm } from "@/components/layout/search-form";

/**
 * Hamburger menu for small screens. Renders a slide-in drawer with search and
 * the primary navigation. Closes on backdrop click, the X button, Escape, or
 * when a link is followed.
 *
 * The drawer is portalled to <body>: the sticky header uses `backdrop-filter`,
 * which would otherwise become the containing block for the fixed overlay and
 * clip it to the header's box.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50"
            onKeyDown={(e) => e.key === "Escape" && close()}
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="absolute inset-0 bg-black/40 animate-fade-in"
            />

            {/* Drawer */}
            <div className="absolute inset-y-0 left-0 flex w-[85vw] max-w-sm flex-col gap-6 bg-background p-5 shadow-2xl animate-slide-in">
              <div className="flex items-center justify-between">
                <Logo onClick={close} />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  autoFocus
                  className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <Suspense>
                <SearchForm onSubmitted={close} />
              </Suspense>

              <nav aria-label="Mobile" className="flex flex-col">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <p className="mt-auto text-xs text-muted-foreground">{siteConfig.tagline}</p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
