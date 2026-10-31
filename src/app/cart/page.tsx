import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  // The cart is personal; keep it out of search engines.
  robots: { index: false },
};

export default function CartPage() {
  return (
    <Container className="py-10 lg:py-14">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your cart</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </Container>
  );
}
