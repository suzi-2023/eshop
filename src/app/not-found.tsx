import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground text-pretty">
        The page you are looking for may have moved or no longer exists.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className={buttonClasses()}>
          Back to home
        </Link>
        <Link href="/products" className={buttonClasses({ variant: "outline" })}>
          Browse products
        </Link>
      </div>
    </Container>
  );
}
