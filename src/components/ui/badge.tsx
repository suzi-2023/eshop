import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "accent" | "success" | "warning" | "danger" | "inverted";

const variants: Record<Variant, string> = {
  neutral: "bg-muted text-foreground",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  inverted: "bg-primary text-primary-foreground",
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
