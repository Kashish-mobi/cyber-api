"use client";

import { cn } from "@/lib/cn";
import Button from "./Button";

type InputProps = {
  type?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  value?: string;
  name?: string;
  id?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  inlineButton?: boolean;
  buttonText?: string;
  variant?: keyof typeof inputStyles;
  onButton?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  required?: boolean;
};

const inputStyles = {
  base: "h-[56px] w-full border border-border-light rounded-[8px] p-[16px] outline-none focus:border-primary focus:ring-0 text-[14px] font-[400] leading-[16px] tracking-[-0.3px] placeholder:text-step-muted placeholder:tracking-[-0.3px] bg-secondary",
};

const Input = ({
  type = "text",
  placeholder,
  className,
  inputClassName,
  value,
  name,
  id,
  inputMode,
  inlineButton,
  buttonText,
  variant,
  onButton,
  onChange,
  maxLength,
  required,
}: InputProps) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        className={cn(variant && inputStyles[variant], className, inputClassName)}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
      />
      {inlineButton && (
        <Button
          variant="dark"
          text={buttonText}
          className="absolute right-[16px] top-1/2 -translate-y-1/2 !h-[32px] !min-w-[77px] !text-[12px] !leading-[16px] !px-[8px] !py-0"
          onClick={onButton}
        />
      )}
    </div>
  );
};

export default Input;
