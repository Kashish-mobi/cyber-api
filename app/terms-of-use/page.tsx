import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Terms of Use — CyberStore",
  description: "The rules and policies for using our website and services.",
};

export default function TermsOfUsePage() {
  return (
    <ComingSoon
      title="Terms of Use"
      description="The rules and policies for using our website and services."
    />
  );
}
