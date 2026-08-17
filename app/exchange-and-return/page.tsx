import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Exchange and Return — CyberStore",
  description: "How to exchange or return products within our return window.",
};

export default function ExchangeAndReturnPage() {
  return (
    <ComingSoon
      title="Exchange and Return"
      description="How to exchange or return products within our return window."
    />
  );
}
