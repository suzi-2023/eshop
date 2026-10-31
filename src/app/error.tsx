"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Route-level error boundary. Shown when a page throws during rendering
 * (for example when the database is unreachable). `reset` re-renders the route.
 */
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-danger">
        Something went wrong
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">We could not load this page</h1>
      <p className="mt-3 max-w-md text-muted-foreground text-pretty">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again in a moment. If the problem persists, contact support."}
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </Container>
  );
}
