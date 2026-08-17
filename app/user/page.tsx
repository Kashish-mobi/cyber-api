import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "My Account — CyberStore",
  description: "Manage your profile, orders, and saved details in one place.",
};

export default function UserPage() {
  return (
    <ComingSoon
      title="My Account"
      description="Manage your profile, orders, and saved details in one place."
    />
  );
}
