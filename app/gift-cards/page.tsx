import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Gift Cards — CyberStore",
  description: "Send the perfect tech gift with digital and physical gift cards.",
};

export default function GiftCardsPage() {
  return (
    <ComingSoon
      title="Gift Cards"
      description="Send the perfect tech gift with digital and physical gift cards."
    />
  );
}
