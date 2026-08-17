"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Input from "@/components/ui/Input";
import Paragraph from "@/components/ui/Paragraph";
import CartStrip from "@/components/CartStrip";
import AppImage from "@/components/ui/Image";

import { useDispatch, useSelector } from "@/redux/hooks";
import { saveCodes } from "@/redux/slices/cartSlice";

import { useRouter } from "nextjs-toploader/app";

export default function CartClient() {
  const dispatch = useDispatch();
  const router = useRouter();

  const products = useSelector((state) => state.cart.cart);

  const [discountCode, setDiscountCode] = useState("");
  const [bonusCardNumber, setBonusCardNumber] = useState("");

  const [errors, setErrors] = useState({
    discountCode: "",
    bonusCardNumber: "",
  });

  const totalQuantity = products.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const validateForm = () => {
    const newErrors = {
      discountCode: "",
      bonusCardNumber: "",
    };

    if (!discountCode.trim()) {
      newErrors.discountCode = "Please enter a discount code.";
    }

    if (!bonusCardNumber.trim()) {
      newErrors.bonusCardNumber = "Please enter your bonus card number.";
    } else if (!/^\d+$/.test(bonusCardNumber.trim())) {
      newErrors.bonusCardNumber =
        "Bonus card number must contain only numbers.";
    }

    setErrors(newErrors);

    return !newErrors.discountCode && !newErrors.bonusCardNumber;
  };

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    dispatch(
      saveCodes({
        discountCode: discountCode.trim(),
        bonusCardNumber: bonusCardNumber.trim(),
      })
    );

    router.push(`/checkout?total=${total.toFixed(2)}`);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="container py-[80px]">
          <Heading
            as="h2"
            variant="cartTitle"
            className="mb-[24px]"
          >
            Shopping Cart
          </Heading>

          <div className="flex flex-col justify-center items-center">
            <AppImage
              src="/website/no-products.avif"
              alt="No products found"
              width={500}
              height={500}
              className="w-full h-full max-w-[500px] max-h-[500px]"
            />

            <Heading
              as="h3"
              variant="cartTitle"
              className="text-center"
            >
              Your cart is empty.
            </Heading>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="container">
        <div className="grid lg:grid-cols-2 lg:gap-[48px] mt-[40px] mb-[38px] lg:my-[111px]">

          {/* LEFT - CART PRODUCTS */}
          <div>
            <Heading as="h2" variant="cartTitle">
              Shopping Cart
            </Heading>

            <div className="pt-[32px] flex flex-col gap-[32px] md:gap-[16px] lg:gap-[33px]">
              {products.map((product, index) => (
                <CartStrip
                  key={product.id}
                  product={product}
                  isLast={index === products.length - 1}
                />
              ))}
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="border-[1px] border-surface-gray rounded-[10px] lg:px-[64px] px-[16px] pt-[55px] pb-[56px] 2xl:py-[56px]">

            <Heading as="h2" variant="cart">
              Order Summary
            </Heading>

            <form
              onSubmit={handleCheckout}
              className="flex flex-col gap-[24px] pt-[40px]"
            >

              {/* DISCOUNT CODE */}
              <div className="flex flex-col gap-[8px]">
                <Paragraph as="p" type="cart">
                  Discount code / Promo code
                </Paragraph>

                <Input
                  type="text"
                  placeholder="Code"
                  className="w-full"
                  inputClassName="w-full"
                  variant="base"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      discountCode: "",
                    }));
                  }}
                />

                {errors.discountCode && (
                  <p className="text-sm text-red-500">
                    {errors.discountCode}
                  </p>
                )}
              </div>

              {/* BONUS CARD */}
              <div className="flex flex-col gap-[8px]">
                <Paragraph as="p" type="cart">
                  Your bonus card number
                </Paragraph>

                <Input
                  type="text"
                  placeholder="Enter Card Number"
                  className="w-full !h-[64px]"
                  inputClassName="w-full"
                  variant="base"
                  value={bonusCardNumber}
                  onChange={(e) => {
                    setBonusCardNumber(e.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      bonusCardNumber: "",
                    }));
                  }}
                  inlineButton={true}
                  buttonText="Apply"
                  onButton={() => {}}
                  maxLength={16}
                />

                {errors.bonusCardNumber && (
                  <p className="text-sm text-red-500">
                    {errors.bonusCardNumber}
                  </p>
                )}
              </div>

              {/* TOTALS */}
              <div className="flex flex-col gap-[16px]">

                {/* SUBTOTAL */}
                <div className="flex justify-between">
                  <Paragraph as="p" type="cartTotal">
                    Subtotal
                  </Paragraph>

                  <Paragraph as="p" type="cartTotal">
                    ${total.toFixed(2)}
                  </Paragraph>
                </div>

                {/* ITEMS */}
                <div className="flex flex-col gap-[8px]">
                  <div className="flex justify-between">
                    <Paragraph
                      as="p"
                      type="cartTotal"
                      className="!text-surface-gray-alt !font-[400]"
                    >
                      Items ({totalQuantity})
                    </Paragraph>

                    <Paragraph as="p" type="cartTotal">
                      {products.length} products
                    </Paragraph>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="flex justify-between">
                  <Paragraph as="p" type="cartTotal">
                    Total
                  </Paragraph>

                  <Paragraph as="p" type="cartTotal">
                    ${total.toFixed(2)}
                  </Paragraph>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <div className="flex w-full justify-center">
                <Button
                  type="submit"
                  variant="solid"
                  text="Checkout"
                  className="!w-full !h-[56px] !text-[16px] !leading-[32px] !px-[16px] !py-[16px] !rounded-[8px] !font-[500] !tracking-[3%] !mt-[48px]"
                />
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}