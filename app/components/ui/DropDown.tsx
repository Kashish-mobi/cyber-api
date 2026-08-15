"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { DownArrow, UpArrow } from "@/app/icons";

type DropDownProps = {
  options: string[];
  selected: string;
  className?: string;
  onSelect?: (option: string) => void;
};

const DropDown = ({
  options,
  selected: initialSelected,
  className,
  onSelect,
}: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    onSelect?.(option);
  };

  return (
    <div className={`relative z-10 min-w-0 ${className || ""}`}>
      <Button
        variant="ghost"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[56px] w-full min-w-0 items-center !justify-between gap-3 rounded-[8px] border-[0.5px] border-light-muted px-[12px] text-primary lg:h-[40px]"
      >
        <span className="min-w-0 truncate text-left text-[14px]">
          {selected}
        </span>

        {open ? <DownArrow /> : <UpArrow />}
      </Button>

      {open && (
        <div
          className="
            absolute right-0 top-[calc(100%+8px)]
            z-20
            min-w-[220px]
            overflow-hidden
            rounded-[6px]
            border border-muted
            bg-white
            shadow-lg
          "
        >
          {options.map((option) => {
            const isSelected = option === selected;

            return (
              <button
                type="button"
                key={option}
                onClick={() => handleSelect(option)}
                className={`
                  flex w-full items-center justify-between
                  px-[16px] py-[10px]
                  text-left text-[14px]
                  transition-colors
                  hover:bg-gray-100
                  !tracking-[0.3px]
                  ${isSelected ? "bg-gray-50 font-medium" : ""}
                `}
              >
                <span>{option}</span>

                {isSelected && (
                  <span className="text-black">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropDown;