"use client";

import { Wishlist } from "../../icons";
import AppImage from "./Image";
import Button from "./Button";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";

/**
 * Single source of truth for product card UI (PDP + Discount).
 * Do not override these from parent sections.
 */
const cardStyles = {
  root: "relative flex h-full w-full flex-col items-center rounded-[8px] bg-surface-card px-[12px] pt-[63px] pb-[24px] md:px-[16px] 2xl:pt-[70px] 2xl:pb-[24px]",
  wishlist:
    "absolute top-[23px] right-[14px] z-10 flex cursor-pointer items-center justify-end md:top-[22px] md:right-[16px]",
  imageWrap:
    "flex h-[104px] w-[104px] shrink-0 items-center justify-center md:h-[160px] md:w-[160px]",
  image: "h-full w-full object-contain",
  titleWrap:
    "mt-[9px] flex min-h-[48px] w-full flex-col items-center justify-start md:mt-[16px]",
  title: "line-clamp-2 w-full",
  priceWrap: "mt-[16px] flex items-center justify-center",
  button: "mt-[16px] w-full md:mt-[24px] 2xl:w-[188px]",
} as const;

export type ProductCardProps = {
  id: string;
  title: string;
  title2?: string;
  price: number;
  image: string;
  buttonText: string;
  currencySymbol?: string;
  onWishlist?: (id: string) => void;
};

export default function ProductCard({
  id,
  title,
  title2 = "",
  price,
  image,
  buttonText,
  currencySymbol = "$",
  onWishlist,
}: ProductCardProps) {
  // One title block like PDP — keeps card height consistent
  const displayTitle = title2 ?  <>
  {title}
  <br />
  {title2}
</> : title;
  const [isWishlist, setIsWishlist] = useState(false);
  const router = useRouter();
  const handleWishlist = () => {
    setIsWishlist(!isWishlist);
  };

  return (
    <div className={cardStyles.root}>
      <button
        type="button"
        className={cardStyles.wishlist + " cursor-pointer"}
        onClick={() => {
          handleWishlist();
        }}
      >
        <Wishlist isWishlist={isWishlist} />
      </button>

      <div className={cardStyles.imageWrap}>
        <AppImage
          src={image}
          alt={title as string}
          width={160}
          height={160}
          className={cardStyles.image}
        />
      </div>

      <div className={cardStyles.titleWrap}>
        <Heading as="h3" variant="card" className={cardStyles.title}>
          {displayTitle}
        </Heading>
      </div>

      <div className={cardStyles.priceWrap}>
        <Paragraph type="price" className="text-center text-primary">
          {currencySymbol}
          {price}
        </Paragraph>
      </div>

      <Button variant="solid" text={buttonText} className={cardStyles.button} onClick={() => {
        router.push(`/products/${id}`);
      }} />
    </div>
  );
}
