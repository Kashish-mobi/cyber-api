import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Terms of Delivery — CyberStore",
  description: "Shipping timelines, costs, and delivery coverage details.",
};

export default function TermsOfDeliveryPage() {
  return (
    <ComingSoon
      title="Terms of Delivery"
      description="Shipping timelines, costs, and delivery coverage details."
    />
  );
}
