"use client";

import { useRouter } from "nextjs-toploader/app";
import homepage from "@/data/homepage.json";
import { cn } from "@/lib/cn";
import { renderParts } from "@/lib/renderParts";
import AppImage from "./ui/Image";
import Button, { type ButtonVariant } from "./ui/Button";
import Heading from "./ui/Heading";
import Paragraph from "./ui/Paragraph";

const { banner } = homepage;

export default function BannerSection() {
  const router = useRouter();

  return (
    <div className="relative h-[512px] sm:h-[448px] w-full">
      <AppImage
        src={banner.image.src}
        alt={banner.image.alt}
        fill
        className="object-cover hidden sm:block"
      />
      <AppImage
        src={banner.image["src-mobile"] as string}
        alt={banner.image["alt-mobile"] as string}
        fill
        className="object-cover block sm:hidden !h-[512px] w-full"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center 2xl:mt-[70px] 2xl:pl-[45px] p-[16px] pt-[14px] md:p-0">
        <Heading as="h4" variant="banner">
          {renderParts(banner.title.parts)}
        </Heading>
        <Paragraph type="banner" className="mb-[40px] text-muted-banner">
          {banner.description}
        </Paragraph>
        <Button
          variant={banner.cta.variant as ButtonVariant}
          text={banner.cta.text}
          className={cn(banner.cta.className)}
          onClick={() => router.push(banner.cta.href)}
        />
      </div>
    </div>
  );
}
