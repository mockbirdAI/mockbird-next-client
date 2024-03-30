import type { Metadata } from "next";

import CheckoutForm from "@/common/components/form/CheckoutForm";

export const metadata: Metadata = {
  title: "Donate with embedded Checkout | Next.js + TypeScript Example",
};

export default function DonatePage(): JSX.Element {
  return (
    <div className="page-container">
      <h1>Donate with embedded Checkout</h1>
      <p>Donate to our project 💖</p>
      <CheckoutForm uiMode="embedded" />
    </div>
  );
}