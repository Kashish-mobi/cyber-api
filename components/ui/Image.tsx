"use client";

import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

type AppImageProps = ImageProps & {
  className?: string;
};

export default function AppImage({
  className,
  alt,
  src,
  unoptimized,
  ...props
}: AppImageProps) {
  const isRemote =
    typeof src === "string" && /^https?:\/\//.test(src);

  return (
    <Image
    {...props}
      alt={alt}
      src={src}
      className={cn(className)}
      unoptimized={unoptimized ?? isRemote}
    />
  );
}
