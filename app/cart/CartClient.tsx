"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Input from "@/components/ui/Input";
import Paragraph from "@/components/ui/Paragraph";
import Pagination from "@/components/ui/Pagination";
import CartStrip from "@/components/CartStrip";
import AppImage from "@/components/ui/Image";

import { useDispatch, useSelector } from "@/redux/hooks";
import {
  saveCodes,
  updateCartQuantity,
  type CartItem,
} from "@/redux/slices/cartSlice";
import { CART_PAGE_SIZE, loadCartItems } from "@/lib/cartApi";
import { useAddToCart } from "@/hooks/useAddToCart";
import { loadLogin } from "@/redux/slices/userSlice";

import { useRouter } from "nextjs-toploader/app";
import { useCurrency } from "@/hooks/useCurrency";

export default function CartClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currencySign } = useCurrency();
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  // use cart already loaded once in provider (cached)
  const cartFromStore = useSelector((state) => state.cart.cart);
  const { tryRemoveFromCart } = useAddToCart();

  const [products, setProducts] = useState<CartItem[]>(cartFromStore);
  const [loading, setLoading] = useState(cartFromStore.length === 0);
  const [page, setPage] = useState(1);

  const [discountCode, setDiscountCode] = useState("");
  const [bonusCardNumber, setBonusCardNumber] = useState("");
  const [appliedBonus, setAppliedBonus] = useState("");
  const [errors, setErrors] = useState({
    discountCode: "",
    bonusCardNumber: "",
  });

  useEffect(() => {
    // already in redux from provider — no new API call (cache)
    if (cartFromStore.length > 0) {
      setProducts(cartFromStore);
      setLoading(false);
      return;
    }

    async function loadCart() {
      setLoading(true);
      const saved = loadLogin();
      const loggedIn = isAuthenticated || !!saved;
      const userId =
        loggedIn && (user?.id || saved?.user?.id)
          ? user?.id || saved!.user.id
          : 0;

      const { items } = await loadCartItems(userId);
      setProducts(items);
      setPage(1);
      setLoading(false);
    }

    loadCart();
  }, [cartFromStore, user?.id, isAuthenticated]);

  const totalPages = Math.max(1, Math.ceil(products.length / CART_PAGE_SIZE));
  const start = (page - 1) * CART_PAGE_SIZE;
  const pageItems = products.slice(start, start + CART_PAGE_SIZE);

  const itemCount = products.length;
  const subtotal = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const bonusDiscount = appliedBonus === "0000" ? 0.05 : 0;
  const discountAmount = subtotal * bonusDiscount;
  const total = subtotal - discountAmount;

  async function handleRemove(productId: number) {
    await tryRemoveFromCart(productId);
    setProducts((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      const newTotalPages = Math.max(1, Math.ceil(next.length / CART_PAGE_SIZE));
      if (page > newTotalPages) setPage(newTotalPages);
      return next;
    });
  }

  function handleQuantityChange(productId: number, quantity: number) {
    dispatch(updateCartQuantity({ id: productId, quantity }));
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      saveCodes({
        discountCode: discountCode.trim(),
        bonusCardNumber: bonusCardNumber.trim(),
      })
    );

    router.push(
      `/checkout?total=${total.toFixed(2)}${bonusDiscount > 0 ? "&bonus=5" : ""}&step=1`
    );
  };

  if (loading) {
    return (
      <div className="container py-[80px] flex justify-center items-center">
        <AppImage src="/website/loading-cart.gif" alt="Loading" width={800} height={800} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="container py-[80px]">
          <Heading as="h2" variant="cartTitle" className="mb-[24px]">
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
            <Heading as="h3" variant="cartTitle" className="text-center">
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
          <div>
            <Heading as="h2" variant="cartTitle">
              Shopping Cart
            </Heading>
            <Paragraph type="body" className="mt-[8px] !text-muted-nav">
              {products.length} items total
            </Paragraph>

            <div className="pt-[32px] flex flex-col gap-[32px] md:gap-[16px] lg:gap-[33px]">
              {pageItems.map((product, index) => (
                <CartStrip
                  key={`${product.id}-${start + index}`}
                  product={product}
                  isLast={index === pageItems.length - 1}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-[40px]">
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            ) : null}
          </div>

          <div className="border-[1px] border-surface-gray rounded-[10px] lg:px-[64px] px-[16px] pt-[55px] pb-[56px] 2xl:py-[56px]">
            <Heading as="h2" variant="cart">
              Order Summary
            </Heading>

            <form
              onSubmit={handleCheckout}
              className="flex flex-col gap-[24px] pt-[40px]"
            >
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
                    setErrors((prev) => ({ ...prev, discountCode: "" }));
                  }}
                />
                {errors.discountCode ? (
                  <p className="text-sm text-red-500">{errors.discountCode}</p>
                ) : null}
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
                  variant="base"
                  value={bonusCardNumber}
                  onChange={(e) => {
                    setBonusCardNumber(e.target.value);
                    setAppliedBonus("");
                    setErrors((prev) => ({ ...prev, bonusCardNumber: "" }));
                  }}
                  inlineButton={true}
                  buttonText="Apply"
                  onButton={() => {
                    const val = bonusCardNumber.trim();
                    if (!val) {
                      setErrors((prev) => ({
                        ...prev,
                        bonusCardNumber: "Please enter your bonus card number.",
                      }));
                      return;
                    }
                    if (!/^\d+$/.test(val)) {
                      setErrors((prev) => ({
                        ...prev,
                        bonusCardNumber:
                          "Bonus card number must contain only numbers.",
                      }));
                      return;
                    }
                    setAppliedBonus(val);
                  }}
                  maxLength={16}
                />
                {errors.bonusCardNumber ? (
                  <p className="text-sm text-red-500">{errors.bonusCardNumber}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-[16px]">
                <div className="flex justify-between">
                  <Paragraph as="p" type="cartTotal">
                    Subtotal
                  </Paragraph>
                  <Paragraph as="p" type="cartTotal">
                    {currencySign(subtotal)}
                  </Paragraph>
                </div>

                <div className="flex justify-between">
                  <Paragraph
                    as="p"
                    type="cartTotal"
                    className="!text-surface-gray-alt !font-[400]"
                  >
                    Items ({itemCount})
                  </Paragraph>
                  <Paragraph as="p" type="cartTotal">
                    {itemCount} products
                  </Paragraph>
                </div>

                {bonusDiscount > 0 ? (
                  <div className="flex justify-between rounded-[8px] bg-green-50 px-[12px] py-[8px]">
                    <Paragraph
                      as="p"
                      type="cartTotal"
                      className="!text-green-600 !font-[500]"
                    >
                      Bonus discount (5%)
                    </Paragraph>
                    <Paragraph
                      as="p"
                      type="cartTotal"
                      className="!text-green-600 !font-[500]"
                    >
                      −{currencySign(discountAmount)}
                    </Paragraph>
                  </div>
                ) : (
                  <div className="flex justify-between rounded-[8px] bg-red-50 px-[12px] py-[8px]">
                    <Paragraph
                      as="p"
                      type="cartTotal"
                      className="!text-red-600 !font-[500]"
                    >
                      Bonus discount
                    </Paragraph>
                    <Paragraph
                      as="p"
                      type="cartTotal"
                      className="!text-red-600 !font-[500]"
                    >
                      −{currencySign(discountAmount)}
                    </Paragraph>
                  </div>
                )}

                <div className="flex justify-between border-t border-border-light pt-[16px]">
                  <Paragraph as="p" type="cartTotal">
                    Total
                  </Paragraph>
                  <Paragraph as="p" type="cartTotal">
                    {currencySign(total)}
                  </Paragraph>
                </div>
              </div>

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
