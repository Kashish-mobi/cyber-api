import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Find an Order — CyberStore",
  description: "Track your order status with your order number and email.",
};

export default function FindAnOrderPage() {
  return (
    <ComingSoon
      title="Find an Order"
      description="Track your order status with your order number and email."
    />
  );
}
