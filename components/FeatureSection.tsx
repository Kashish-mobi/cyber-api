"use client";

import { useRouter } from "nextjs-toploader/app";
import homepage from "@/data/homepage.json";
import { cn } from "@/lib/cn";
import { renderParts } from "@/lib/renderParts";
import AppImage from "./ui/Image";
import Button, { type ButtonVariant } from "./ui/Button";
import Heading from "./ui/Heading";
import Paragraph from "./ui/Paragraph";

const { playstation, airpods, visionPro, macbook } = homepage.features;

export default function FeatureSection() {
  return (
    <>
      {/* < 1300px: stacked on mobile, 2×2 from md */}
      <MobileFeatureGrid />
      {/* ≥ 1300px: original desktop layout */}
      <DesktopFeatureGrid />
    </>
  );
}

/* ---------- Mobile / tablet (< 1300px) ---------- */

function MobileFeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 desktop:hidden">
      <MobileCard item={airpods} />
      <MobileCard item={visionPro} />
      <MobileCard item={playstation} />
      <MobileCard item={macbook} showCta />
    </div>
  );
}

function MobileCard({
  item,
  showCta = false,
}: {
  item: typeof airpods | typeof visionPro | typeof playstation | typeof macbook;
  showCta?: boolean;
}) {
  const router = useRouter();
  const isDark = "theme" in item && item.theme === "dark";
  const cta = "cta" in item ? item.cta : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center px-[16px] py-[40px] text-center",
        item.className
      )}
    >
      <AppImage
        src={item.mobileImage.src}
        alt={item.mobileImage.alt}
        width={item.mobileImage.width}
        height={item.mobileImage.height}
        className="mb-[24px] object-contain"
        style={{
          width: item.mobileImage.width,
          height: "auto",
          transform: `scale(${item.mobileImage.scale ?? 1})`,
        }}
      />

      <Heading
        as="p"
        variant="featureMobile"
        className={isDark ? "text-secondary" : "text-primary"}
      >
        {renderParts(item.mobileTitle.parts)}
      </Heading>

      <Paragraph
        className={cn(
          "mt-[8px] max-w-[360px] whitespace-pre-line text-[16px]",
          isDark ? "text-muted-alt" : "text-muted",
          "descriptionClass" in item ? item.descriptionClass : undefined
        )}
      >
        {item.description.replace(/\n/g, " ")}
      </Paragraph>

      {showCta && cta ? (
        <Button
          variant={cta.variant as ButtonVariant}
          text={cta.text}
          className="mt-[16px] desktop:mt-[24px] w-full desktop:max-w-[191px]"
          onClick={() => router.push(cta.href)}
        />
      ) : null}
    </div>
  );
}

/* ---------- Desktop (≥ 1300px) ---------- */

function DesktopFeatureGrid() {
  const router = useRouter();

  return (
    <div className="hidden grid-cols-2 desktop:grid">
      <div className="grid grid-cols-1">
        {/* PlayStation */}
        <div
          className={cn(
            "relative grid min-h-[328px] grid-cols-1",
            playstation.className
          )}
        >
          <div className="relative h-[328px] overflow-hidden bg-secondary">
            <AppImage
              src={playstation.image.src}
              alt={playstation.image.alt}
              width={playstation.image.width}
              height={playstation.image.height}
              className="absolute top-0 left-0 h-[328px] w-[360px] object-cover"
            />
            <div className="relative z-10 ml-auto flex h-full max-w-[385px] flex-col justify-center pr-[48px] text-left">
              <Heading as="p" variant="feature" className="mb-[16px]">
                {renderParts(playstation.title.parts)}
              </Heading>
              <Paragraph className="text-muted">
                {playstation.description}
              </Paragraph>
            </div>
          </div>
        </div>

        {/* AirPods + Vision Pro */}
        <div className="grid grid-cols-2">
          <SplitCard item={airpods} />
          <SplitCard item={visionPro} />
        </div>
      </div>

      {/* MacBook */}
      <div
        className={cn(
          "relative grid min-h-[600px] grid-cols-1",
          macbook.className
        )}
      >
        <AppImage
          src={macbook.image.src}
          alt={macbook.image.alt}
          width={macbook.image.width}
          height={macbook.image.height}
          className="absolute right-0 bottom-[50px]"
        />
        <div className="relative z-10 flex items-center justify-start">
          <div className="flex max-w-[405px] flex-col items-start justify-start pl-[56px] text-left">
            <Heading as="p" variant="featureLg" className="mb-[16px]">
              {renderParts(macbook.title.parts)}
            </Heading>
            <Paragraph className="text-muted">{macbook.description}</Paragraph>
            <Button
              variant="dark"
              text={macbook.cta.text}
              className="mt-[16px]"
              onClick={() => router.push(macbook.cta.href)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SplitCard({
  item,
}: {
  item: typeof airpods | typeof visionPro;
}) {
  const isDark = item.theme === "dark";

  return (
    <div className={cn("relative h-[272px] overflow-hidden", item.className)}>
      {item.image.fill ? (
        <AppImage
          src={item.image.src}
          alt={item.image.alt}
          fill
          className="object-contain object-left-bottom"
        />
      ) : (
        <AppImage
          src={item.image.src}
          alt={item.image.alt}
          width={item.image.width}
          height={item.image.height}
          className="absolute bottom-[40px] left-0 object-contain"
        />
      )}

      <div className="flex h-full items-center justify-end pr-[68px]">
        <div>
          <Heading
            variant="featureSm"
            className={isDark ? "text-secondary" : "text-primary"}
          >
            {renderParts(item.title.parts)}
          </Heading>
          <Paragraph
            className={cn(
              "mt-[8px] whitespace-pre-line",
              isDark ? "text-muted-alt" : "text-muted"
            )}
          >
            {item.description}
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
