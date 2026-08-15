import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Cart — CyberStore",
  description: "Review your selected items and proceed to checkout.",
};

export default function CartPage() {
  return <CartClient />;
}
