import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Credit and Payment — CyberStore",
  description: "Learn about available payment methods and financing options.",
};

export default function CreditAndPaymentPage() {
  return (
    <ComingSoon
      title="Credit and Payment"
      description="Learn about available payment methods and financing options."
    />
  );
}
