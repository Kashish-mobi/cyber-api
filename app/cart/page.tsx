"use client";
import Button from "../components/ui/Button";
import Heading from "../components/ui/Heading";
import Input from "../components/ui/Input";
import Paragraph from "../components/ui/Paragraph";
import CartStrip from "../components/CartStrip";
import SeoHeader from "../components/SeoHeader";

const cartStrip = [
  {
    id: 1,
      name: "Apple iPhone 14 Pro Max 128Gb Deep Purple",
      serialNumber: "#25139526913984",
      image: "/website/cart/iphone.png",
      price: 1399,
      quantity: 1,
  },
  {
    id: 2,
    name: "AirPods Max Silver",
    serialNumber: "#53459358345",
    image: "/website/cart/headphone.png",
    price: 549,
    quantity: 1,
  },
  {
    id: 3,
    name: "Apple Watch Series 9 GPS 41mm Starlight Aluminium ",
    serialNumber: "#63632324",
    image: "/website/cart/watch.png",
    price: 399,
    quantity: 1,
  },
];
export default function CartPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SeoHeader title="Cart" description="Cart" />
      <div className="container">
        <div className="grid lg:grid-cols-2 lg:gap-[48px] mt-[40px] mb-[38px] lg:my-[111px]">
          <div>
            <Heading as="h2" variant="cartTitle">ShoppingCart</Heading>
            <div className="pt-[32px] flex flex-col gap-[32px] md:gap-[16px] lg:gap-[33px]">
              {cartStrip.map((item: any, index: number)=>{
                return(
                  <CartStrip key={item.id} product={item} isLast={index === cartStrip.length - 1} />
                )
              })}
            </div>
           
          </div>


          <div className="border-[1px] border-surface-gray rounded-[10px] lg:px-[64px] px-[16px] pt-[55px] pb-[56px] 2xl:py-[56px]">
            <Heading as="h2" variant="cart">Order Summary</Heading>
            <div className="flex flex-col gap-[24px] pt-[40px]">
              <div className="flex flex-col gap-[8px]">
                <Paragraph as="p" type="cart">Discount code / Promo code</Paragraph>
                <Input type="text" placeholder="Code" className="w-full" inputClassName="w-full" variant="base" onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-[8px]">
                <Paragraph as="p" type="cart">Your bonus card number</Paragraph>
                <Input type="text" placeholder="Enter Card Number" className="w-full !h-[64px]" inputClassName="w-full" onChange={() => {}} variant="base" inlineButton={true} buttonText="Apply" btnAction={() => {}} />
              </div>
              <div className="flex flex-col gap-[16px]">
                <div className="flex justify-between ">
                  <Paragraph as="p" type="cartTotal">Subtotal</Paragraph>
                  <Paragraph as="p" type="cartTotal">$2347</Paragraph>
                </div>
                <div className="flex flex-col gap-[8px]">
                <div className="flex justify-between ">
                  <Paragraph as="p" type="cartTotal" className="!text-surface-gray-alt !font-[400]">Estimated Tax</Paragraph>
                  <Paragraph as="p" type="cartTotal">$50</Paragraph>
                </div>
                <div className="flex justify-between ">
                  <Paragraph as="p" type="cartTotal" className="!text-surface-gray-alt !font-[400]">Estimated shipping & Handling</Paragraph>
                  <Paragraph as="p" type="cartTotal">$29</Paragraph>
                </div>
                </div>
                <div className="flex justify-between ">
                  <Paragraph as="p" type="cartTotal">Total</Paragraph>
                  <Paragraph as="p" type="cartTotal">$2426</Paragraph>
                </div>
              </div>
             
            </div>
            <div className="flex w-full justify-center">
               <Button variant="solid" text="Checkout" className="!w-full !h-[56px] !text-[16px] !leading-[32px] !px-[16px] !py-[16px] !rounded-[8px] !font-[500] !tracking-[3%] !mt-[48px]" onClick={() => {}} />
            </div>
           

          </div>

        </div>
      </div>
    </div>
  );
}
