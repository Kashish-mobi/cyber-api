import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared product grid — same columns/gaps for PDP + Discount. */
const gridStyles =
  "grid w-full grid-cols-2 gap-[15px] md:grid-cols-2 md:gap-[16px] lg:grid-cols-4";

export default function ProductGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(gridStyles, className)}>{children}</div>;
}
