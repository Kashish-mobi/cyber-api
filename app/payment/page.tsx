import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Payment — CyberStore",
  description: "Secure checkout options and payment help for your orders.",
};

export default function PaymentPage() {
  return (
    <ComingSoon
      title="Payment"
      description="Secure checkout options and payment help for your orders."
    />
  );
}
