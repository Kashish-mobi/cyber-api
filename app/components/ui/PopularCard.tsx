import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import AppImage from "./Image";
import Button from "./Button";
import Heading from "./Heading";
import Paragraph from "./Paragraph";

export type PopularCardProps = {
  image: string;
  title: string;
  desc: string;
  buttonText: string;
  slug?: string;
  cardClassName?: string;
  theme?: "light" | "dark" | string;
  imageClassName?: string;
  /** Mobile scale X (default 1) */
  imageScaleX?: number;
  /** Mobile scale Y (default 1) */
  imageScaleY?: number;
  /** md+ scale X — falls back to imageScaleX */
  imageScaleXMd?: number;
  /** md+ scale Y — falls back to imageScaleY */
  imageScaleYMd?: number;
  dots?: ReactNode;
};

export default function PopularCard({
  image,
  title,
  desc,
  buttonText,
  slug = "",
  cardClassName = "",
  theme = "light",
  imageClassName,
  imageScaleX = 1,
  imageScaleY = 1,
  imageScaleXMd,
  imageScaleYMd,
  dots,
}: PopularCardProps) {
  const isDark = theme === "dark";

  const imageStyle = {
    "--img-sx": imageScaleX,
    "--img-sy": imageScaleY,
    "--img-sx-md": imageScaleXMd ?? imageScaleX,
    "--img-sy-md": imageScaleYMd ?? imageScaleY,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative flex h-auto flex-col items-center overflow-hidden px-[32px] pt-[63px] pb-[40px] md:pt-[56px] 2xl:py-[22px] 2xl:pb-[56px]",
        cardClassName
      )}
    >
      {/* Fixed box so scale does not grow the carousel height */}
      <div className="mb-[6px] flex h-[331px] w-[321px] items-center justify-center overflow-hidden md:mb-[14px] md:h-[327px] md:w-[360px]">
        <AppImage
          src={image}
          alt={title}
          width={321}
          height={331}
          className={cn(
            "popular-card-image h-full w-full object-contain",
            imageClassName
          )}
          style={imageStyle}
        />
      </div>

      <div className="mt-[8px] flex flex-col items-center md:mt-[16px] md:items-start">
        <Heading
          as="h3"
          variant="popular"
          className={cn(
            "mb-[8px] md:mb-[16px]",
            isDark ? "text-secondary" : "text-primary"
          )}
        >
          {title}
        </Heading>
        <Paragraph
          className={cn(
            "mb-[16px] text-center md:text-start",
            isDark ? "text-secondary" : "text-muted"
          )}
        >
          {desc}
        </Paragraph>
      </div>

      <Button
        href={slug}
        variant={isDark ? "outline-light" : "dark"}
        text={buttonText}
        className={cn(
          "flex w-[191px] items-center justify-center self-center md:self-start",
          isDark &&
            "hover:!border-primary hover:!bg-secondary hover:!text-primary"
        )}
      />

      {dots ? (
        <div className="mt-[48px] flex items-center justify-center self-center">
          {dots}
        </div>
      ) : null}
    </div>
  );
}
