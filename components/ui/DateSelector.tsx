"use client";

import { useState } from "react";
import { UpArrow, DownArrow } from "@/icons";

type DateSelectorProps = {
  selected?: string;
  onChange?: (date: string) => void;
  className?: string;
};

const DateSelector = ({
  selected: initialSelected = "",
  onChange,
  className = "",
}: DateSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected);
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleDateSelect = (day: number) => {
    const date = new Date(year, month, day);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Update inside component
    setSelected(formattedDate);

    // Also notify parent if needed
    onChange?.(formattedDate);

    setOpen(false);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-[8px] text-primary"
      >
        {selected || "Select Date"}

        {open ? <DownArrow /> : <UpArrow />}
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-[calc(100%+8px)]
            z-[99]
            w-[300px]
            rounded-[8px]
            border border-light-muted
            bg-white
            p-[16px]
            shadow-lg
          "
        >
          {/* Header */}
          <div className="mb-[16px] flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-full hover:bg-gray-100"
            >
              ←
            </button>

            <span className="text-[16px] font-medium text-primary">
              {monthName}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-full hover:bg-gray-100"
            >
              →
            </button>
          </div>

          {/* Weekdays */}
          <div className="mb-[8px] grid grid-cols-7">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="
                  flex h-[32px]
                  items-center justify-center
                  text-[12px]
                  font-medium
                  text-muted
                "
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-[4px]">
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;

              const date = new Date(year, month, day);

              const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              const isSelected = selected === formattedDate;

              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    flex h-[36px] w-[36px]
                    items-center justify-center
                    rounded-full
                    text-[14px]
                    text-primary
                    hover:bg-gray-100
                    ${
                      isSelected
                        ? "bg-primary text-white hover:bg-primary"
                        : ""
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;