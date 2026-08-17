"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import AppImage from "./ui/Image";
import Button from "./ui/Button";
import Heading from "./ui/Heading";
import Paragraph from "./ui/Paragraph";
import ConfirmBox from "./ui/ConfirmBox";
import { Cross, Minus, Plus } from "@/icons";
import { useDispatch, useSelector } from "@/redux/hooks";
import {
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from "@/redux/slices/cartSlice";

function Quantity({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="flex h-[32px] items-center gap-[8px]">
      <Button
        variant="icon"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="!h-[24px] !min-h-[24px] !w-[24px] !min-w-[24px]"
      >
        <Minus />
      </Button>
      <Paragraph as="span" type="cartQuantity">
        {quantity}
      </Paragraph>
      <Button
        variant="icon"
        onClick={() => onChange(quantity + 1)}
        className="!h-[24px] !min-h-[24px] !w-[24px] !min-w-[24px]"
      >
        <Plus />
      </Button>
    </div>
  );
}

function CartRow({
  product,
  onClose,
  showRemove = false,
}: {
  product: CartItem;
  onClose: () => void;
  showRemove?: boolean;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex items-center gap-[12px] border-b border-border-light py-[12px] last:border-b-0">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-[12px] text-left"
        onClick={() => {
          onClose();
          router.push(`/products/${product.id}`);
        }}
      >
        <AppImage
          src={product.thumbnail}
          alt={product.title}
          width={56}
          height={56}
          className="h-[56px] w-[56px] shrink-0 object-contain"
        />
        <Heading as="h3" variant="card" className="!text-left line-clamp-2">
          {product.title}
        </Heading>
      </button>

      <Quantity
        quantity={product.quantity}
        onChange={(quantity) =>
          dispatch(updateCartQuantity({ id: product.id, quantity }))
        }
      />

      {showRemove ? (
        <>
          <Button
            variant="icon"
            className="!border-0 !p-0"
            onClick={() => setConfirmOpen(true)}
          >
            <Cross />
          </Button>
          <ConfirmBox
            open={confirmOpen}
            title="Remove from cart?"
            message={`Are you sure you want to remove ${product.title} from your cart?`}
            onNo={() => setConfirmOpen(false)}
            onYes={() => {
              dispatch(removeFromCart(product.id));
              setConfirmOpen(false);
            }}
          />
        </>
      ) : null}
    </div>
  );
}

export function MiniCart({
  onClose,
  simple = false,
  showClose = false,
}: {
  onClose: () => void;
  simple?: boolean;
  showClose?: boolean;
}) {
  const products = useSelector((state) => state.cart.cart);
  const router = useRouter();

  const goToCart = () => {
    onClose();
    router.push("/cart");
  };

  if (products.length === 0) {
    return (
      <div className="relative p-[16px]">
        {showClose ? (
          <button
            type="button"
            aria-label="Close"
            className="absolute top-[12px] right-[12px] flex h-[32px] w-[32px] items-center justify-center"
            onClick={onClose}
          >
            <Cross />
          </button>
        ) : null}
        <Heading as="h3" variant="cartTitle">
          Shopping Cart
        </Heading>
        <Paragraph type="body" className="mt-[12px] !text-muted-nav">
          Your cart is empty.
        </Paragraph>
        <Button
          variant="solid"
          text="View Cart"
          className="mt-[16px] !h-[48px] !w-full"
          onClick={goToCart}
        />
      </div>
    );
  }

  return (
    <div className="flex max-h-[70vh] flex-col">
      {!simple ? (
        <div className="relative border-b border-border-light px-[16px] py-[16px] pr-[48px]">
          <Heading as="h3" variant="cartTitle">
            Shopping Cart
          </Heading>
          {showClose ? (
            <button
              type="button"
              aria-label="Close"
              className="absolute top-[12px] right-[12px] flex h-[32px] w-[32px] items-center justify-center"
              onClick={onClose}
            >
              <Cross />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-[16px]">
        {products.map((product) => (
          <CartRow
            key={product.id}
            product={product}
            onClose={onClose}
            showRemove={!simple}
          />
        ))}
      </div>

      <div className="border-t border-border-light p-[16px]">
        <Button
          variant="solid"
          text="View Cart"
          className="!h-[48px] !w-full"
          onClick={goToCart}
        />
      </div>
    </div>
  );
}

export function MiniCartModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40 px-[16px]"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-[16px] border border-surface-gray bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <MiniCart onClose={onClose} showClose />
      </div>
    </div>
  );
}

export default MiniCart;
