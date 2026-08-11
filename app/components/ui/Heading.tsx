import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const headingStyles = {
  display:
    "text-secondary text-[72px] leading-[72px] lg:text-[96px] font-[100] md:leading-[0.7em] tracking-[-1.3px]",
  banner:
    "text-secondary text-[48px] lg:text-[72px] font-[100] leading-[72px] tracking-[-1px]",
  section: "text-primary text-[24px] font-[500] leading-[32px] tracking-[0.2px]",
  feature: "text-primary text-[49px] font-[500] leading-[40px]",
  featureSm: "text-[29px] font-[300] leading-[40px]",
  featureLg:
    "text-primary text-[32px] md:text-[48px] lg:text-[64px] font-[100] leading-[56px] tracking-[0px]",
  popular:
    "text-[49px] md:text-[33px] font-[300] leading-[48px] tracking-[0] text-center md:mb-[16px] mb-[17px]",
  featureMobile:
    "text-[32px] font-[300] leading-[40px] tracking-[1.5px] text-center",
  card: "text-[16px] font-[500] leading-[24px] tracking-[0] text-primary text-center",
  footer: "text-[16px] leading-[16px] font-[600] tracking-[0px] text-secondary",
  filter: "text-primary text-[18px] font-[500] leading-[24px] tracking-[0.5px]",
  cart: "text-primary text-[20px] font-[700] leading-[16px] tracking-[0px]",
  cartTitle: "text-primary text-[24px] font-[500] leading-[24px] tracking-[0.7px]",
  cartPrice: "text-primary text-[20px] font-[700] leading-[16px] tracking-[0px] border-b border-primary",
  cartTotal: "text-primary text-[20px] font-[700] leading-[32px] tracking-[3%px]",
  checkoutStep: "text-primary text-[14px] font-[500] leading-[16px] tracking-[0.7px]",
  checkoutStepTitle: "text-primary text-[19px] font-[500] leading-[24px] tracking-[0.7px]",
  productTitle: "text-primary text-[40px] font-[500] leading-[40px] tracking-[0.4px]",
} as const;

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  variant?: keyof typeof headingStyles;
  className?: string;
  children?: ReactNode;
};

export default function Heading({
  as: Tag = "h2",
  variant = "section",
  className,
  children,
}: HeadingProps) {
  return (
    <Tag className={cn(headingStyles[variant], className)}>{children}</Tag>
  );
}
