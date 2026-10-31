"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
  /** Used for the accessible label, e.g. the product name. */
  label?: string;
};

/** Minus / count / plus control used on the product page and in the cart. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Number.POSITIVE_INFINITY,
  size = "md",
  className,
  label = "Quantity",
}: Props) {
  const buttonSize = size === "sm" ? "size-8" : "size-11";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          buttonSize,
          "grid place-items-center rounded-full transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent",
        )}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          buttonSize,
          "grid place-items-center rounded-full transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent",
        )}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
