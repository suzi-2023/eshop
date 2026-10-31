import { cn, discountPercent, formatPrice } from "@/lib/utils";

type Props = {
  priceCents: number;
  compareAtCents?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl sm:text-3xl",
};

/** Current price with an optional struck-through "was" price. */
export function Price({ priceCents, compareAtCents = null, size = "md", className }: Props) {
  const discount = discountPercent(priceCents, compareAtCents);

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", sizes[size], className)}>
      <span className="font-semibold tabular-nums">{formatPrice(priceCents)}</span>
      {discount && compareAtCents && (
        <>
          <s className="text-muted-foreground tabular-nums font-normal">
            {formatPrice(compareAtCents)}
          </s>
          <span className="sr-only">({discount}% off)</span>
        </>
      )}
    </p>
  );
}
