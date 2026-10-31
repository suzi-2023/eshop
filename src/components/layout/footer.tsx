import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";

const columns = [
  {
    title: "Shop",
    links: siteConfig.nav.map((item) => ({ label: item.label, href: item.href })),
  },
  {
    title: "Help",
    // Placeholder routes; create these pages when the content is ready.
    links: [
      { label: "Shipping & delivery", href: "#" },
      { label: "Returns & exchanges", href: "#" },
      { label: "Track your order", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground text-pretty">{siteConfig.tagline}</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Prices shown in {siteConfig.currency}. Secure checkout.</p>
        </Container>
      </div>
    </footer>
  );
}
