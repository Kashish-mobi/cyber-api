"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = {
  "outline-light":
    "border border-secondary text-secondary text-[16px] font-[500] leading-[1em] tracking-[0.2px] px-[24px] py-[12px] 2xl:py-[16px] rounded-[8px] h-[56px] min-w-[191px] hover:bg-secondary hover:text-primary transition-all duration-300",
  "fill-dark":
    "text-[16px] font-[500] leading-[1em] tracking-[0.2px] px-[24px] py-[12px] 2xl:py-[16px] rounded-[8px] h-[56px] min-w-[191px] bg-primary text-secondary transition-all duration-300 hover:bg-primary/70",
  dark:
    "border border-primary text-primary text-[16px] font-[500] leading-[1em] tracking-[0.2px] px-[24px] py-[16px] rounded-[8px] h-[56px] min-w-[191px] hover:bg-primary hover:text-secondary transition-all duration-300",
  solid:
    "bg-primary text-secondary text-[14px] font-[500] leading-[24px] h-[48px] w-full rounded-[8px] 2xl:w-[188px] hover:opacity-90 transition-all duration-300",
  ghost: "bg-transparent text-primary",
  page:"bg-surface-card text-primary h-[32px] w-[32px] rounded-[5px] lg:rounded-[8px] hover:bg-primary hover:text-secondary transition-all duration-300", 
  "active-page":"bg-primary text-secondary border border-primary h-[32px] w-[32px] rounded-[5px] lg:rounded-[8px] hover:bg-primary hover:text-secondary transition-all duration-300",
  icon: "bg-transparent text-primary h-[24px] w-[24px] hover:font-bold transition-all duration-300",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

type BaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children?: ReactNode;
  text?: string;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  onClick?: () => void;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = "solid",
  className,
  children,
  text,
  ...props
}: ButtonProps) {
  const content = children ?? text;
  const classes = cn(buttonVariants[variant], "cursor-pointer inline-flex items-center justify-center", className);

  if ("href" in props && props.href) {
    const { href, onClick } = props;
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
