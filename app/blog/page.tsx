import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Blog — CyberStore",
  description: "Tips, reviews, and news about the latest gadgets and tech.",
};

export default function BlogPage() {
  return (
    <ComingSoon
      title="Blog"
      description="Tips, reviews, and news about the latest gadgets and tech."
    />
  );
}
