import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Bonus Program — CyberStore",
  description: "Earn rewards and unlock member benefits with every purchase.",
};

export default function BonusProgramPage() {
  return (
    <ComingSoon
      title="Bonus Program"
      description="Earn rewards and unlock member benefits with every purchase."
    />
  );
}
