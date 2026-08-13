import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Service Contracts — CyberStore",
  description: "Protect your devices with extended service and care plans.",
};

export default function ServiceContractsPage() {
  return (
    <ComingSoon
      title="Service Contracts"
      description="Protect your devices with extended service and care plans."
    />
  );
}
