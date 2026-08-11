import AuthForm from "@/app/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center bg-surface-soft px-[16px] py-[48px]">
        <AuthForm mode="login" />
      </main>
    </div>
  );
}
