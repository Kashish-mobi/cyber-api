"use client";

import { Wishlist } from "@/icons";
import AppImage from "./Image";
import Button from "./Button";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useDispatch, useSelector } from "@/redux/hooks";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { MiniCartModal } from "../MiniCart";
import ConfirmBox from "./ConfirmBox";

const cardStyles = {
  root: "relative flex h-full w-full cursor-pointer flex-col items-center rounded-[8px] bg-surface-card px-[12px] pt-[63px] pb-[24px] md:px-[16px] 2xl:pt-[70px] 2xl:pb-[24px]",
  wishlist:
    "absolute top-[23px] right-[14px] z-5 flex cursor-pointer items-center justify-end md:top-[22px] md:right-[16px]",
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
  id: number;
  title: string;
  brand?: string;
  title2?: string;
  price: number;
  thumbnail: string;
  buttonText: string;
  currencySymbol?: string;
};

export default function ProductCard({
  id,
  title,
  brand = "",
  title2 = "",
  price,
  thumbnail,
  currencySymbol = "$",
}: ProductCardProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isWishlist = hasMounted && wishlist.includes(Number(id));
  const isInCart = hasMounted && cart.some((item) => item.id === Number(id));
  const subtitle = brand || title2;
  const displayTitle = subtitle ? (
    <>
      {title}
      <br />
      {subtitle}
    </>
  ) : (
    title
  );

  const goToProduct = () => {
    router.push(`/products/${id}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlist) {
      dispatch(removeFromWishlist(Number(id)));
    } else {
      dispatch(addToWishlist(Number(id)));
    }
  };

  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      setConfirmOpen(true);
      return;
    }
    dispatch(
      addToCart({
        id: Number(id),
        title,
        price,
        thumbnail,
        quantity: 1,
      })
    );
    setCartOpen(true);
  };

  return (
    <div className={cardStyles.root} onClick={goToProduct}>
      <button
        type="button"
        className={cardStyles.wishlist + " cursor-pointer"}
        onClick={handleWishlist}
      >
        <Wishlist isWishlist={isWishlist} />
      </button>

      <div className={cardStyles.imageWrap}>
        <AppImage
          src={thumbnail}
          alt={title}
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

      <Button
        variant="solid"
        text={isInCart ? "Remove from Cart" : "Add to Cart"}
        className={cardStyles.button}
        onClick={handleCart}
      />

      <MiniCartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      <ConfirmBox
        open={confirmOpen}
        title="Remove from cart?"
        message={`Are you sure you want to remove ${title} from your cart?`}
        onNo={() => setConfirmOpen(false)}
        onYes={() => {
          dispatch(removeFromCart(Number(id)));
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
