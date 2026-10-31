import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <ShoppingBag className="size-4" aria-hidden />
      </span>
      <span className="text-lg font-semibold tracking-tight">{siteConfig.name}</span>
    </Link>
  );
}
