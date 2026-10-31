import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  reviewCount?: number;
  /** Compact mode hides the numeric rating and shows only the count. */
  compact?: boolean;
  className?: string;
};

const reviewFormatter = new Intl.NumberFormat("en", { notation: "compact" });

export function Rating({ rating, reviewCount, compact = false, className }: Props) {
  const rounded = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-1.5 text-sm", className)}>
      <div
        className="flex items-center gap-0.5"
        aria-label={`Rated ${rating.toFixed(1)} out of 5`}
        role="img"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              i < rounded ? "fill-amber-400 text-amber-400" : "fill-border text-border",
            )}
            aria-hidden
          />
        ))}
      </div>
      {!compact && <span className="font-medium">{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-muted-foreground">({reviewFormatter.format(reviewCount)})</span>
      )}
    </div>
  );
}
