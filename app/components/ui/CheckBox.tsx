"use client";

import { cn } from "@/lib/cn";
import Paragraph from "./Paragraph";

type CheckBoxProps = {
  label: string;
  showLabel?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
};

function CheckBox({
  label,
  showLabel = false,
  checked,
  defaultChecked,
  onChange,
  className,
  labelClassName,
}: CheckBoxProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-[8px]", className)}>
      <input
        type="checkbox"
        aria-label={label}
        className="peer sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
      />

      <span
        className="
          flex h-[16px] w-[16px] shrink-0 items-center justify-center
          rounded-[4px] border border-muted bg-white
          peer-checked:border-black
          peer-checked:bg-black
          peer-checked:after:content-['✓']
          peer-checked:after:text-[11px]
          peer-checked:after:font-bold
          peer-checked:after:text-white
        "
      />

      {showLabel ? (
        <Paragraph as="span" type="cart" className={labelClassName}>
          {label}
        </Paragraph>
      ) : null}
    </label>
  );
}

export default CheckBox;
