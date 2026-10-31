import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Grey placeholder block shown while content loads. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden className={cn("animate-pulse rounded-xl bg-muted", className)} {...props} />
  );
}
