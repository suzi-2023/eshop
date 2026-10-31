import { RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

const items = [
  {
    icon: Truck,
    title: "Fast, free delivery",
    text: `Free shipping on orders over ${formatPrice(siteConfig.freeShippingThresholdCents)}. Most orders arrive in 2-4 days.`,
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    text: "Changed your mind? Return any unused item within 30 days for a full refund.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    text: "Cards, UPI and wallets, processed by a PCI-compliant payment provider.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted shopping",
    text: "Describe what you need in plain words and get matching products in seconds.",
  },
];

export function ValueProps() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
