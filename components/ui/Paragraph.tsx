import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** All paragraph size/weight styles live here — pick one with `type`. */
const paragraphStyles = {
  body: "text-[14px] font-[400] leading-[24px] tracking-[0.1px] md:tracking-[0px]",
  lead: "text-[19px] font-[400] leading-[24px] md:text-[20px] md:leading-[1em] tracking-[0px] md:tracking-[-0.85px]",
  eyebrow: "text-[25px] font-[600] leading-[32px]",
  banner: "text-[16px] font-[400] leading-[32px]",
  footer: "text-[14px] font-[500] leading-[32px] tracking-[-0.1px]",
  footerleft:"md:text-[14px] text-[13px] font-[500] md:leading-[1.71em] leading-[24px] text-center md:text-left",
  nav: "text-[16px] font-[500] leading-[1em] tracking-[0px]",
  price: "text-[24px] font-[600] leading-[24px]",
  filterOptions: "text-[15px] font-[500] leading-[24px] tracking-[0px]",
  filterCount: "text-[12px] font-[400] leading-[24px] tracking-[0px]",
  cart: "text-[14px] font-[500] leading-[16px] tracking-[0px]",
  cartTotal: "text-[16px] font-[500] leading-[32px] tracking-[3%]",
  address: "text-[18px] font-[400] leading-[24px] tracking-[0px]",
  typeStripe: "text-[12px] font-[500] leading-[1em] tracking-[0px]",
  cartQuantity: "text-[16px] font-[500] leading-[32px] tracking-[0px] w-[40px] text-center border-[0.5px] border-surface-gray-light rounded-[4px] ",
  productPrice:"text-[32px] font-[600] leading-[48px] tracking-[2px] text-primaryp",
  productOriginalPrice:"text-[24px] font-[400] leading-[32px] tracking-[0.1px] text-primary-light line-through",
  productColor:"text-[15px] font-[500] leading-[24px] tracking-[0px] text-primary",
  productDescription:"text-[16px] font-[400] leading-[24px] tracking-[0.1px]",
  productDescription2:"text-[15px] font-[400] leading-[24px] tracking-[0.1px]",
  form2:"text-[15px] font-[400] leading-[16px] tracking-[-0.2px]",
  starLabel:"text-[18px] font-[400] leading-[16px] tracking-[-0.2px]",
} as const;

export type ParagraphType = keyof typeof paragraphStyles;

type ParagraphProps = {
  as?: "p" | "span";
  type?: ParagraphType;
  className?: string;
  children?: ReactNode;
};

export default function Paragraph({
  as: Tag = "p",
  type = "body",
  className,
  children,
}: ParagraphProps) {
  return (
    <Tag className={cn(paragraphStyles[type], className)}>{children}</Tag>
  );
}
