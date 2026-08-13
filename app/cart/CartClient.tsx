"use client";

import Button from "../components/ui/Button";
import Heading from "../components/ui/Heading";
import Input from "../components/ui/Input";
import Paragraph from "../components/ui/Paragraph";
import CartStrip from "../components/CartStrip";

type CartProduct = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
};

type Cart = {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};

export default function CartClient({ cart }: { cart: Cart | null }) {
  const products = cart?.products || [];

  if (!cart || products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div className="container py-[80px]">
          <Heading as="h2" variant="cartTitle">
            Shopping Cart
          </Heading>
          <Paragraph type="body" className="mt-[24px]">
            Your cart is empty.
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="container">
        <div className="grid lg:grid-cols-2 lg:gap-[48px] mt-[40px] mb-[38px] lg:my-[111px]">
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

          <div className="border-[1px] border-surface-gray rounded-[10px] lg:px-[64px] px-[16px] pt-[55px] pb-[56px] 2xl:py-[56px]">
            <Heading as="h2" variant="cart">
              Order Summary
            </Heading>
            <div className="flex flex-col gap-[24px] pt-[40px]">
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
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <Paragraph as="p" type="cart">
                  Your bonus card number
                </Paragraph>
                <Input
                  type="text"
                  placeholder="Enter Card Number"
                  className="w-full !h-[64px]"
                  inputClassName="w-full"
                  onChange={() => {}}
                  variant="base"
                  inlineButton={true}
                  buttonText="Apply"
                  btnAction={() => {}}
                />
              </div>
              <div className="flex flex-col gap-[16px]">
                <div className="flex justify-between">
                  <Paragraph as="p" type="cartTotal">
                    Subtotal
                  </Paragraph>
                  <Paragraph as="p" type="cartTotal">
                    ${cart.total.toFixed(2)}
                  </Paragraph>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <div className="flex justify-between">
                    <Paragraph
                      as="p"
                      type="cartTotal"
                      className="!text-surface-gray-alt !font-[400]"
                    >
                      Discount
                    </Paragraph>
                    <Paragraph as="p" type="cartTotal">
                      -${(cart.total - cart.discountedTotal).toFixed(2)}
                    </Paragraph>
                  </div>
                  <div className="flex justify-between">
                    <Paragraph
                      as="p"
                      type="cartTotal"
                      className="!text-surface-gray-alt !font-[400]"
                    >
                      Items ({cart.totalQuantity})
                    </Paragraph>
                    <Paragraph as="p" type="cartTotal">
                      {cart.totalProducts} products
                    </Paragraph>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Paragraph as="p" type="cartTotal">
                    Total
                  </Paragraph>
                  <Paragraph as="p" type="cartTotal">
                    ${cart.discountedTotal.toFixed(2)}
                  </Paragraph>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <Button
                variant="solid"
                text="Checkout"
                className="!w-full !h-[56px] !text-[16px] !leading-[32px] !px-[16px] !py-[16px] !rounded-[8px] !font-[500] !tracking-[3%] !mt-[48px]"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
