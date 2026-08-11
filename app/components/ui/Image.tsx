"use client";

import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

type AppImageProps = ImageProps & {
  className?: string;
};

export default function AppImage({ className, alt, ...props }: AppImageProps) {
  return <Image alt={alt} className={cn(className)} {...props} />;
}
