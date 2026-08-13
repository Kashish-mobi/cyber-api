import type { Metadata } from "next";
import AuthForm from "@/app/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign up — CyberStore",
  description: "Create a CyberStore account and start shopping.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center bg-surface-soft px-[16px] py-[48px]">
        <AuthForm mode="signup" />
      </main>
    </div>
  );
}
