"use client";

import { useState } from "react";
import Button from "./Button";
import { DownArrow, UpArrow } from "@/app/icons";

type DropDownProps = {
  options: string[];
  selected: string;
  className?: string;
};

const DropDown = ({
  options,
  selected: initialSelected,
  className,
}: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
  };

  return (
    <div className="relative z-50">
      <Button
        variant="ghost"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex lg:h-[40px] h-[56px] min-w-[163px] sm:min-w-[256px] items-center rounded-[8px] !justify-between gap-3 border-light-muted border-[0.5px] px-[16px] text-primary ${className}`}
      >
        <span className="text-[14px]">
          {selected}
        </span>

        {open ? <DownArrow /> : <UpArrow />}
      </Button>

      {open && (
        <div
          className="
            absolute right-0 top-[calc(100%+8px)]
            z-[99]
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