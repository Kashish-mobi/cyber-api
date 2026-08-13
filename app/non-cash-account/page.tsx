import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Non-cash Account — CyberStore",
  description: "Set up and manage non-cash payments for your business needs.",
};

export default function NonCashAccountPage() {
  return (
    <ComingSoon
      title="Non-cash Account"
      description="Set up and manage non-cash payments for your business needs."
    />
  );
}
