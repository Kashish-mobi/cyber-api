import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "About Us — CyberStore",
  description: "Learn who we are and why we build great tech shopping experiences.",
};

export default function AboutPage() {
  return (
    <ComingSoon
      title="About Us"
      description="Learn who we are and why we build great tech shopping experiences."
    />
  );
}
