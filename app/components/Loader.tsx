"use client";

import { useAppSelector } from "@/redux/hooks";

export default function GlobalLoader() {
  const isLoading = useAppSelector(
    (state) => state.loader.isLoading
  );

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );
}