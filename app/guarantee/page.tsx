import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Guarantee — CyberStore",
  description: "Warranty coverage and how we stand behind every product.",
};

export default function GuaranteePage() {
  return (
    <ComingSoon
      title="Guarantee"
      description="Warranty coverage and how we stand behind every product."
    />
  );
}
