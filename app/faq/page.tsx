import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "FAQ — CyberStore",
  description: "Quick answers about orders, shipping, returns, and accounts.",
};

export default function FaqPage() {
  return (
    <ComingSoon
      title="Frequently Asked Questions"
      description="Quick answers about orders, shipping, returns, and accounts."
    />
  );
}
