import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Contact Us — CyberStore",
  description: "Get in touch with our support team for help with orders and products.",
};

export default function ContactPage() {
  return (
    <ComingSoon
      title="Contact Us"
      description="Get in touch with our support team for help with orders and products."
    />
  );
}
