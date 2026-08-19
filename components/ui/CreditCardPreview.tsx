"use client";

import { cn } from "@/lib/cn";

type CreditCardPreviewProps = {
  cardNumber?: string;
  cardholder?: string;
  className?: string;
};

function ChipIcon() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="31" height="23" rx="3.5" fill="#D4A017" stroke="#B8860B" />
      <path d="M0 8H32M0 16H32M10 0V24M22 0V24" stroke="#B8860B" strokeOpacity="0.5" />
    </svg>
  );
}

function ContactlessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M6.5 7.5C7.8 8.8 7.8 11.2 6.5 12.5M9 5C11.5 7.5 11.5 12.5 9 15M11.5 2.5C15.2 6.2 15.2 13.8 11.5 17.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" aria-hidden>
      <circle cx="15" cy="12" r="10" fill="#EB001B" />
      <circle cx="25" cy="12" r="10" fill="#F79E1B" />
      <path
        d="M20 4.7C21.7 6.1 22.8 8.4 22.8 12C22.8 15.6 21.7 17.9 20 19.3C18.3 17.9 17.2 15.6 17.2 12C17.2 8.4 18.3 6.1 20 4.7Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export default function CreditCardPreview({
  cardNumber = "4085 9536 8475 9530",
  cardholder = "",
  className,
}: CreditCardPreviewProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[16px] bg-primary text-secondary aspect-[1.7/1] max-w-[420px]",
        className
      )}
    >
      {/* Diagonal stripe texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(255,255,255,0.04) 40px, rgba(255,255,255,0.04) 80px)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-[24px] md:p-[28px]">
        <div className="flex items-center gap-[12px]">
          <ChipIcon />
          <ContactlessIcon />
        </div>

        <p className="text-[18px] md:text-[22px] font-[500] tracking-[2px] leading-[1.2]">
          {cardNumber}
        </p>

        <div className="flex items-end justify-between gap-[16px]">
          <p className="text-[12px] md:text-[14px] font-[400] tracking-[0.4px] text-secondary/80">
            {cardholder}
          </p>
          <MastercardLogo />
        </div>
      </div>
    </div>
  );
}
