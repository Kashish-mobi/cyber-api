"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Address, Shipping, Payment, Edit, Delete, PlusLine } from "@/icons";
import Heading from "@/components/ui/Heading";
import Radio from "@/components/ui/Radio";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import DateSelector from "@/components/ui/DateSelector";
import Tabs from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import CheckBox from "@/components/ui/CheckBox";
import CreditCardPreview from "@/components/ui/CreditCardPreview";
import AddressModal from "@/components/AddressModal";
import ConfirmBox from "@/components/ui/ConfirmBox";
import { useDispatch, useSelector } from "@/redux/hooks";
import {
  addAddress,
  deleteAddress,
  formatAddress,
  selectAddress,
  setShippingDate,
  setShippingMethod,
  setStep,
  updateAddress,
  type Address as AddressType,
} from "@/redux/slices/checkoutSlice";
import { clearCart, clearCodes } from "@/redux/slices/cartSlice";
import { useRouter } from "nextjs-toploader/app";
import { useCurrency } from "@/hooks/useCurrency";

const paymentTabs = [
  { id: "credit-card", label: "Credit Card" },
  { id: "paypal", label: "PayPal" },
  { id: "paypal-credit", label: "PayPal Credit" },
];

const checkoutSteps = [
  { id: 1, step: 1, title: "Address", Icon: Address },
  { id: 2, step: 2, title: "Shipping", Icon: Shipping },
  { id: 3, step: 3, title: "Payment", Icon: Payment },
];

const shippingMethods = [
  {
    id: 1,
    priceUsd: 0,
    title: "Regularly shipment",
    date: "17 Oct, 2023",
    description: null as string | null,
  },
  {
    id: 2,
    priceUsd: 8.5,
    title: "Get your delivery as soon as possible",
    date: "1 Oct, 2023",
    description: null as string | null,
  },
  {
    id: 3,
    priceUsd: null as number | null,
    title: "Schedule",
    description: "Pick a date when you want to get your delivery",
    date: null as string | null,
  },
];

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function parseStepParam(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(3, Math.max(1, Math.round(parsed)));
}

function TypeStripe({ type }: { type: string }) {
  return (
    <div className="flex h-[23px] items-center justify-center rounded-[4px] bg-primary px-[8px]">
      <Paragraph type="typeStripe" className="text-white">
        {type}
      </Paragraph>
    </div>
  );
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currencySign } = useCurrency();
  const cart = useSelector((state) => state.cart.cart);
  const {
    addresses,
    selectedAddressId,
    shippingMethodId,
    shippingDate,
    step,
  } = useSelector((state) => state.checkout);

  const [hasMounted, setHasMounted] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"credit-card" | "paypal" | "paypal-credit">(
    "credit-card"
  );
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const goToStep = (nextStep: number) => {
    const clamped = Math.min(3, Math.max(1, nextStep));
    dispatch(setStep(clamped));

    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(clamped));
    router.replace(`/checkout?${params.toString()}`);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const rawStep = searchParams.get("step");
    const urlStep = parseStepParam(rawStep);
    dispatch(setStep(urlStep));

    if (!rawStep) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", String(urlStep));
      router.replace(`/checkout?${params.toString()}`);
    }
  }, [hasMounted, searchParams, dispatch, router]);

  useEffect(() => {
    if (!hasMounted || thankYou) return;
    if (cart.length === 0) router.push("/cart");
  }, [hasMounted, cart.length, thankYou, router]);

  const mobileStart = Math.min(step - 1, checkoutSteps.length - 2);
  const mobileSteps = checkoutSteps.slice(mobileStart, mobileStart + 2);

  const renderStep = (checkoutStep: (typeof checkoutSteps)[number]) => {
    const isActive = checkoutStep.step === step;
    const tone = isActive ? "!text-primary" : "!text-step-muted";
    const { Icon } = checkoutStep;
    return (
      <div key={checkoutStep.id} className="flex w-[160px] shrink-0 items-center gap-[8px]">
        <Icon className={tone} />
        <div>
          <Heading as="h3" variant="checkoutStep" className={tone}>
            Step {checkoutStep.step}
          </Heading>
          <Heading as="h4" variant="checkoutStepTitle" className={tone}>
            {checkoutStep.title}
          </Heading>
        </div>
      </div>
    );
  };

  const validateStep = (current: number) => {
    const next: Record<string, string> = {};

    if (current === 1) {
      if (!selectedAddressId) {
        next.address = "Please select a delivery address.";
      }
    }

    if (current === 2) {
      if (shippingMethodId === 3 && !shippingDate) {
        next.shippingDate = "Please pick a delivery date.";
      }
    }

    if (current === 3) {
      if (activeTab === "credit-card") {
        if (!cardholderName.trim()) next.cardholderName = "Cardholder name is required.";
        const digits = cardNumber.replace(/\s/g, "");
        if (digits.length < 16) next.cardNumber = "Enter a valid 16-digit card number.";
        if (!expDate.trim()) next.expDate = "Expiry date is required.";
        if (cvv.length < 3) next.cvv = "CVV must be 3 digits.";
      } else {
        if (!paypalEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
          next.paypalEmail = "Enter a valid PayPal email.";
        }
        if (activeTab === "paypal-credit" && !cardholderName.trim()) {
          next.cardholderName = "Full name is required.";
        }
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setErrors({});
    goToStep(step + 1);
  };

  const handlePay = () => {
    if (!validateStep(3)) return;
    dispatch(clearCart());
    dispatch(clearCodes());
    dispatch(setStep(1));
    setThankYou(true);
  };

  if (!hasMounted) return null;

  if (thankYou) {
    return (
      <div className="flex justify-center">
        <div className="container py-[80px] md:py-[120px]">
          <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
            <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-primary">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12.5L9.5 17L19 7.5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Heading as="h2" variant="cartTitle" className="mt-[32px] !text-[32px] !leading-[40px]">
              Thank you for your order
            </Heading>
            <Paragraph type="lead" className="mt-[16px] !text-muted-nav">
              Your order has been placed successfully. We will get it ready and send it out soon.
            </Paragraph>
            <div className="mt-[40px] flex w-full flex-col items-center gap-[12px] sm:flex-row sm:justify-center">
              <Button
                variant="fill-dark"
                className="!h-[56px] w-full !min-w-0 sm:!w-[220px]"
                onClick={() => router.push("/products")}
              >
                Continue shopping
              </Button>
              <Button
                variant="dark"
                className="!h-[56px] w-full !min-w-0 sm:!w-[220px]"
                onClick={() => router.push("/")}
              >
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="container">
        <div className="py-[32px] md:py-[72px]">
          <div className="flex items-center gap-[21px] md:hidden">
            {mobileSteps.map(renderStep)}
          </div>
          <div className="hidden gap-[21px] md:flex md:items-center md:justify-between">
            {checkoutSteps.map(renderStep)}
          </div>
        </div>

        <div className="my-[48px] flex flex-col gap-[32px]">
            {step === 1 && (
              <div className="flex flex-col gap-[32px]">
                <Heading as="h3" variant="checkoutStepTitle">
                  Select Address
                </Heading>
                <div className="flex flex-col gap-[24px]">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex flex-col gap-[16px] rounded-[8px] bg-surface-card p-[24px] md:flex-row md:items-center md:justify-between md:gap-0"
                    >
                      <div className="flex items-start gap-[16px]">
                        <Radio
                          id={`address-${address.id}`}
                          name="address"
                          value={String(address.id)}
                          checked={selectedAddressId === address.id}
                          onChange={() => dispatch(selectAddress(address.id))}
                          width="24px"
                          height="24px"
                        />
                        <div className="flex min-w-0 flex-1 flex-col items-start gap-[16px]">
                          <div className="flex items-center gap-[25px] md:gap-[16px]">
                            <Paragraph type="address">{address.label}</Paragraph>
                            <TypeStripe type={address.type} />
                          </div>
                          <div className="flex w-full items-center justify-between md:contents md:items-start md:gap-[16px]">
                            <div className="flex flex-col items-start gap-[8px]">
                              <Paragraph type="address" className="!tracking-[-1.1px]">
                                {formatAddress(address)}
                              </Paragraph>
                              <Paragraph type="address" className="!tracking-[-1.1px]">
                                {address.phone}
                              </Paragraph>
                            </div>
                            <div className="mt-[-40px] flex shrink-0 items-center gap-[24px] md:hidden">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAddress(address);
                                  setModalOpen(true);
                                }}
                              >
                                <Edit />
                              </button>
                              <button type="button" onClick={() => setDeleteId(address.id)}>
                                <Delete />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden items-center gap-[24px] md:flex">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(address);
                            setModalOpen(true);
                          }}
                        >
                          <Edit />
                        </button>
                        <button type="button" onClick={() => setDeleteId(address.id)}>
                          <Delete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="flex cursor-pointer flex-col items-center justify-center gap-[8px] pt-[16px]"
                  onClick={() => {
                    setEditingAddress(null);
                    setModalOpen(true);
                  }}
                >
                  <PlusLine />
                  <Paragraph type="cart">Add New Address</Paragraph>
                </button>
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-[16px] md:gap-[15px]">
                <div className="mb-[16px]">
                  <Heading as="h3" variant="checkoutStepTitle">
                    Shipment Method
                  </Heading>
                </div>
                {shippingMethods.map((method) => (
                  <div
                    className="rounded-[8px] border border-gray-200 bg-white p-[24px]"
                    key={method.id}
                  >
                    <div className="grid grid-cols-2 items-center justify-between">
                      <div className="flex flex-col items-start gap-[8px] md:flex-row md:gap-[16px]">
                        <Radio
                          id={`shipping-method-${method.id}`}
                          name="shipping-method"
                          value={String(method.id)}
                          checked={shippingMethodId === method.id}
                          onChange={() => dispatch(setShippingMethod(method.id))}
                          width="24px"
                          height="24px"
                        />
                        {method.priceUsd !== null && (
                          <Paragraph type="address">
                            {method.priceUsd === 0 ? "Free" : currencySign(method.priceUsd)}
                          </Paragraph>
                        )}
                        {method.title && (
                          <Paragraph type="address">{method.title}</Paragraph>
                        )}
                        {method.description && (
                          <Paragraph type="address">{method.description}</Paragraph>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        {method.date ? (
                          <Paragraph type="address">{method.date}</Paragraph>
                        ) : (
                          <DateSelector
                            selected={shippingDate}
                            onChange={(date) => dispatch(setShippingDate(date))}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {errors.shippingDate && (
                  <p className="text-sm text-red-500">{errors.shippingDate}</p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-[32px]">
                <Heading as="h3" variant="checkoutStepTitle">
                  Payment
                </Heading>
                <Tabs
                  tabs={paymentTabs}
                  activeTab={activeTab}
                  onChange={(id) =>
                    setActiveTab(id as "credit-card" | "paypal" | "paypal-credit")
                  }
                  className="mb-0 justify-between gap-0 2xl:mb-0"
                  tabClassName="text-center"
                />

                {activeTab === "credit-card" && (
                  <div className="flex flex-col gap-[24px]">
                    <div className="flex items-center justify-center">
                      <CreditCardPreview
                        cardNumber={cardNumber || "4085 9536 8475 9530"}
                        cardholder={cardholderName || ""}
                      />
                    </div>
                    <div className="flex flex-col gap-[16px]">
                      <div className="flex flex-col gap-[4px]">
                        <Input
                          placeholder="Cardholder Name"
                          variant="base"
                          value={cardholderName}
                          onChange={(e) => { setCardholderName(e.target.value); setErrors((p) => ({ ...p, cardholderName: "" })); }}
                        />
                        {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <Input
                          placeholder="Card Number"
                          variant="base"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setErrors((p) => ({ ...p, cardNumber: "" })); }}
                        />
                        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-[16px]">
                        <div className="flex flex-col gap-[4px]">
                          <Input
                            placeholder="Exp. Date (MM/YY)"
                            variant="base"
                            value={expDate}
                            onChange={(e) => { setExpDate(e.target.value); setErrors((p) => ({ ...p, expDate: "" })); }}
                          />
                          {errors.expDate && <p className="text-sm text-red-500">{errors.expDate}</p>}
                        </div>
                        <div className="flex flex-col gap-[4px]">
                          <Input
                            placeholder="CVV"
                            type="password"
                            variant="base"
                            inputMode="numeric"
                            value={cvv}
                            maxLength={3}
                            onChange={(e) => { setCvv(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrors((p) => ({ ...p, cvv: "" })); }}
                          />
                          {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                    <CheckBox
                      label="Same as billing address"
                      showLabel
                      checked={sameAsBilling}
                      onChange={setSameAsBilling}
                    />
                  </div>
                )}

                {activeTab !== "credit-card" && (
                  <div className="flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[12px] rounded-[16px] border border-border-light bg-surface-card p-[24px]">
                      <Paragraph type="address">
                        {activeTab === "paypal" ? "Pay with PayPal" : "PayPal Credit"}
                      </Paragraph>
                      <Paragraph type="cart" className="text-muted">
                        Enter your PayPal email to complete your purchase.
                      </Paragraph>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <Input
                        type="email"
                        placeholder="PayPal Email"
                        variant="base"
                        value={paypalEmail}
                        onChange={(e) => { setPaypalEmail(e.target.value); setErrors((p) => ({ ...p, paypalEmail: "" })); }}
                      />
                      {errors.paypalEmail && <p className="text-sm text-red-500">{errors.paypalEmail}</p>}
                    </div>
                    {activeTab === "paypal-credit" && (
                      <div className="flex flex-col gap-[4px]">
                        <Input
                          placeholder="Full Name"
                          variant="base"
                          value={cardholderName}
                          onChange={(e) => { setCardholderName(e.target.value); setErrors((p) => ({ ...p, cardholderName: "" })); }}
                        />
                        {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
                      </div>
                    )}
                    <CheckBox
                      label="Same as billing address"
                      showLabel
                      checked={sameAsBilling}
                      onChange={setSameAsBilling}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-[24px] pt-[32px]">
              <Button
                variant="dark"
                className="!h-[64px] !w-[158px] !min-w-[158px] md:!w-[210px]"
                onClick={() => {
                  if (step === 1) {
                    router.push("/cart");
                    return;
                  }
                  goToStep(step - 1);
                }}
              >
                Back
              </Button>
              {step < 3 ? (
                <Button
                  variant="fill-dark"
                  className="!h-[64px] !w-[158px] !min-w-[158px] md:!w-[210px]"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="fill-dark"
                  className="!h-[64px] !w-[158px] !min-w-[158px] md:!w-[210px]"
                  onClick={handlePay}
                >
                  Pay
                </Button>
              )}
            </div>
        </div>
      </div>

      <AddressModal
        open={modalOpen}
        address={editingAddress}
        onClose={() => setModalOpen(false)}
        onSave={(data) => {
          if (editingAddress) {
            dispatch(updateAddress({ ...data, id: editingAddress.id }));
          } else {
            dispatch(addAddress(data));
          }
          setModalOpen(false);
        }}
      />
      <ConfirmBox
        open={deleteId !== null}
        title="Delete address?"
        message="This address will be removed from your checkout list."
        onNo={() => setDeleteId(null)}
        onYes={() => {
          if (deleteId !== null) dispatch(deleteAddress(deleteId));
          setDeleteId(null);
        }}
      />
    </div>
  );
}
