"use client";

import { useRouter } from "nextjs-toploader/app";
import homepage from "@/data/homepage.json";
import { renderParts } from "@/lib/renderParts";
import AppImage from "./ui/Image";
import Button, { type ButtonVariant } from "./ui/Button";
import Heading from "./ui/Heading";
import Paragraph from "./ui/Paragraph";

const { hero } = homepage;

export default function MainSection() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center bg-hero overflow-hidden">
      <div className="container flex flex-col items-center justify-center md:flex-row md:gap-[40px] 2xl:gap-[120px]">
        <div className="flex flex-col items-center justify-center pt-[88px] md:items-start md:justify-start md:pt-0">
          <Paragraph type="eyebrow" className="mb-[16px] text-muted lg:mb-[28px]">
            {hero.eyebrow}
          </Paragraph>

          <Heading
            as="h1"
            variant="display"
            className="mb-[16px] text-center md:mb-[24px] md:text-left"
          >
            {renderParts(hero.title.parts)}
          </Heading>

          <Paragraph
            type="lead"
            className="mb-[32px] text-center text-muted md:text-left lg:mb-[27px]"
          >
            {hero.description}
          </Paragraph>

          <Button
            variant={hero.cta.variant as ButtonVariant}
            text={hero.cta.text}
            onClick={() => router.push(hero.cta.href)}
          />
        </div>

        <div className="flex h-[337px] items-center justify-center md:h-full">
          <AppImage
            src={hero.image.src}
            alt={hero.image.alt}
            width={hero.image.width}
            height={hero.image.height}
            className="mt-[150px] scale-[0.95] object-contain md:mt-0 md:scale-[1]"
          />
        </div>
      </div>
    </div>
  );
}
