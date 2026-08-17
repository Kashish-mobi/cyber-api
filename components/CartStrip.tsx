"use client";

import Paragraph from "./ui/Paragraph";
import AppImage from "./ui/Image";
import Heading from "./ui/Heading";
import Button from "./ui/Button";
import { Minus, Plus, Cross } from "@/icons";
import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { store } from "@/redux/store";
import {
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from "@/redux/slices/cartSlice";
import ConfirmBox from "./ui/ConfirmBox";

const QuantitySelector = ({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center h-[32px] gap-[9px]">
      <Button
        variant="icon"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="!w-[24px] !h-[24px] !min-w-[24px] !min-h-[24px]"
      >
        <Minus />
      </Button>
      <Paragraph as="span" type="cartQuantity">
        {quantity}
      </Paragraph>
      <Button
        variant="icon"
        onClick={() => onChange(quantity + 1)}
        className="!w-[24px] !h-[24px] !min-w-[24px] !min-h-[24px]"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default function CartStrip({
  product,
  isLast,
}: {
  product: CartItem;
  isLast: boolean;
}) {
  const dispatch = store.dispatch;
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const lineTotal = product.price * product.quantity;

  const goToProduct = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div
      className={`grid grid-cols-[auto_1fr] items-center gap-x-[16px] gap-y-[8px] border-b-[0.5px] border-surface-line-gray pt-[24px] pb-[56px] 2xl:pb-[31px] lg:flex lg:flex-col lg:items-center lg:gap-[24px] 2xl:flex-row 2xl:justify-between 2xl:gap-0 cursor-pointer ${isLast ? "!border-b-0" : "border-b"}`}
      onClick={goToProduct}
    >
      <div className="contents lg:flex lg:items-center lg:gap-4">
        <AppImage
          src={product.thumbnail}
          alt={product.title}
          width={90}
          height={90}
          className="row-span-2 shrink-0 self-center object-contain"
        />

        <div className="min-w-0 lg:max-w-[190px]">
          <Heading as="h3" variant="card" className="!text-left">
            {product.title}
          </Heading>

          <Paragraph type="body" className="mt-2">
            #{product.id}
          </Paragraph>
        </div>
      </div>

      <div
        className="col-start-2 flex w-full items-center justify-between lg:w-auto lg:justify-start lg:gap-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <QuantitySelector
          quantity={product.quantity}
          onChange={(quantity) =>
            dispatch(updateCartQuantity({ id: product.id, quantity }))
          }
        />

        <Heading as="h3" variant="cartTotal">
          ${lineTotal.toFixed(2)}
        </Heading>

        <Button variant="icon" className="!p-0 border-0">
          <Cross onClick={() => setConfirmOpen(true)} />
        </Button>
      </div>

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
    </div>
  );
}
