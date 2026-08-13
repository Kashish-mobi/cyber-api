// Server component — no "use client"
// Renders the SEO head tags + the interactive form (client component).

import SeoHeader from "./SeoHeader";
import AuthFormClient from "./AuthFormClient";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <>
      <SeoHeader
        title={isLogin ? "Log in — CyberStore" : "Sign up — CyberStore"}
        description={
          isLogin
            ? "Log in to your CyberStore account."
            : "Create a CyberStore account and start shopping."
        }
      />
      <AuthFormClient mode={mode} />
    </>
  );
}
