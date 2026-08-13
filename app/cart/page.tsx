import type { Metadata } from "next";
import CartClient from "./CartClient";
import { store } from "@/redux/store";
import { getCartByUserId } from "@/redux/slices/cartSlice";

export const metadata: Metadata = {
  title: "Cart — CyberStore",
  description: "Review your selected items and proceed to checkout.",
};

export default async function CartPage() {
  const result = await store.dispatch(getCartByUserId(1));

  // API returns { carts: [ { products: [...], total, ... } ] }
  // We use the first cart for this user
  const cart = result.payload?.carts?.[0] || null;

  return <CartClient cart={cart} />;
}
