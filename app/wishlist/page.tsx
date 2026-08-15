import type { Metadata } from "next";
import WishlistClient from "./WishlistClient";



export const metadata: Metadata = {
  title: "Wishlist — CyberStore",
  description: "View and manage the products you've saved to your wishlist.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
