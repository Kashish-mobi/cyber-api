import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log in — CyberStore",
  description: "Log in to your CyberStore account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center bg-surface-soft px-[16px] py-[48px]">
        <AuthForm mode="login" />
      </main>
    </div>
  );
}
