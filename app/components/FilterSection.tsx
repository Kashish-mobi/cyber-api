"use client";

import { useEffect, useState } from "react";
import {
  LeftArrow,
  DownArrow,
  UpArrow,
} from "../icons";
import Button from "./ui/Button";
import Heading from "./ui/Heading";
import CheckBox from "./ui/CheckBox";
import SearchBox from "./ui/SearchBox";
import Paragraph from "./ui/Paragraph";
import Input from "./ui/Input";

/* ---------------------------------- */
/* Price UI */
/* ---------------------------------- */

const MIN_PRICE = 0;
const MAX_PRICE = 5000;

function formatPrice(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function parsePrice(raw: string) {
  return Number(raw.replace(/\s/g, "").replace(/,/g, ""));
}

function PriceUI() {
  const [minPrice, setMinPrice] = useState(1299);
  const [maxPrice, setMaxPrice] = useState(3999);

  const minPercent =
    ((minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPercent =
    ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  const handleMinChange = (value: number) => {
    const next = Math.min(Math.max(value, MIN_PRICE), maxPrice - 1);
    setMinPrice(next);
  };

  const handleMaxChange = (value: number) => {
    const next = Math.max(Math.min(value, MAX_PRICE), minPrice + 1);
    setMaxPrice(next);
  };

  return (
    <div className="flex w-full flex-col gap-[12px] pt-[26px]">
      {/* Labels */}
      <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-[400] leading-[1] text-muted-light">
          From
        </span>
        <span className="text-[14px] font-[400] leading-[1] text-muted-light">
          To
        </span>
      </div>

      {/* Inputs + dash */}
      <div className="flex w-full items-center justify-between gap-[8px]">
        <Input
          type="text"
          placeholder="0"
          value={formatPrice(minPrice)}
          onChange={(e) => {
            const value = parsePrice(e.target.value);
            if (!Number.isNaN(value)) handleMinChange(value);
          }}
          inputClassName=""
          className="h-[40px] w-[109px] min-w-[109px] rounded-[4px] border border-[#D4D4D4] bg-transparent px-[12px] text-[14px] font-[400] text-primary outline-none"
        />

        <span className="h-[1px] w-[20px] shrink-0 bg-[#E7E7E7]" />

        <Input
          type="text"
          placeholder="1 299"
          value={formatPrice(maxPrice)}
          onChange={(e) => {
            const value = parsePrice(e.target.value);
            if (!Number.isNaN(value)) handleMaxChange(value);
          }}
          inputClassName=""
          className="h-[40px] w-[109px] min-w-[109px] rounded-[4px] border border-[#D4D4D4] bg-transparent px-[12px] text-end text-[14px] font-[400] text-primary outline-none"
        />
      </div>

      {/* Dual range slider */}
      <div className="relative mt-[16px] h-[24px] w-full">
        {/* Inactive track — thin gray */}
        <div className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 rounded-full bg-[#D4D4D4]" />

        {/* Active track — thicker black */}
        <div
          className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-primary"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={1}
          value={minPrice}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="price-slider price-slider-min"
          aria-label="Minimum price"
        />

        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={1}
          value={maxPrice}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="price-slider price-slider-max"
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Filter Data */
/* ---------------------------------- */

const filterSectionData = {
  filters: [
    {
      label: "Price",
      options: [],
    },
    {
      label: "Brand",
      options: [
        "Apple",
        "Samsung",
        "Xiaomi",
        "Poco",
        "OPPO",
        "Honor",
        "Motorola",
        "Nokia",
        "Realme",
      ],
    },
    {
      label: "Battery capacity",
      options: [],
    },
    {
      label: "Screen type",
      options: [],
    },
    {
      label: "Screen diagonal",
      options: [],
    },
    {
      label: "Protection class",
      options: [],
    },
    {
      label: "Built-in memory",
      options: [],
    },
  ],
};

/* ---------------------------------- */
/* Desktop Filter */
/* ---------------------------------- */

export function FilterSectionDesktop() {
  const [openFilter, setOpenFilter] = useState<string | null>(
    null,
  );

  const handleOpen = (label: string) => {
    setOpenFilter((prev) =>
      prev === label ? null : label,
    );
  };

  return (
    <div className="flex flex-col gap-[23px]">
      {filterSectionData.filters.filter(filter => filter.label !== "Price").map((filter) => {
        const isOpen = openFilter === filter.label;

        return (
          <div key={filter.label}>
            {/* Header */}
            <Button
              variant="ghost"
              className="flex w-full items-center !justify-between gap-2 border-b-[0.5px] border-border-light py-[12px] text-left"
              onClick={() => handleOpen(filter.label)}
            >
              <Heading as="h3" variant="filter">
                {filter.label}
              </Heading>

              <span>
                {isOpen ? (
                  <DownArrow />
                ) : (
                  <UpArrow />
                )}
              </span>
            </Button>

            {/* Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen
                  ? "max-h-[600px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {/* Price */}

              {/* Other filters */}
              {filter.options.length > 0 && (
                <div className="flex flex-col gap-[16px] pt-[16px]">
                  <SearchBox
                    placeholder="Search"
                    className="!h-[40px] w-full"
                    inputClassName="w-full bg-transparent tracking-[-0.44px] outline-none"
                  />

                  <div className="flex flex-col gap-[8px]">
                    {filter.options.map((option) => (
                      <div
                        key={option}
                        className="flex h-[24px] items-center gap-[8px] text-left"
                      >
                        <CheckBox label={option} />

                        <Paragraph
                          as="p"
                          type="filterOptions"
                        >
                          {option}
                        </Paragraph>

                        <Paragraph
                          as="p"
                          type="filterCount"
                        >
                          {filter.options.length}
                        </Paragraph>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- */
/* Mobile Filter Props */
/* ---------------------------------- */

type FilterSectionMobileProps = {
  isOpen: boolean;
  onClose: () => void;
};

/* ---------------------------------- */
/* Mobile Filter */
/* ---------------------------------- */

export function FilterSectionMobile({
  isOpen,
  onClose,
}: FilterSectionMobileProps) {
  /*
   * Prevent background page from scrolling
   * while mobile filter is open.
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /*
   * Price is open by default.
   * Other filters are closed.
   */
  const [openFilter, setOpenFilter] = useState<string[]>([
    "Price",
  ]);

  /*
   * Multiple filters can be opened at the same time.
   *
   * Price cannot be closed.
   */
  const handleOpen = (label: string) => {
    if (label === "Price") {
      return;
    }

    setOpenFilter((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label);
      }

      return [...prev, label];
    });
  };

  return (
    <>
      {/* -------------------------------- */}
      {/* Overlay */}
      {/* -------------------------------- */}

      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* -------------------------------- */}
      {/* Filter Drawer */}
      {/* -------------------------------- */}

      <div
        className={`fixed right-0 top-[88px] z-[110] h-[calc(100vh-88px)] w-full max-w-full bg-secondary px-[17px] transition-transform duration-500 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="flex items-center justify-start gap-x-[16px] py-[15.5px] pt-[31px]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center"
            aria-label="Close filters"
          >
            <LeftArrow
              width="24"
              height="24"
            />
          </button>

          <Heading as="h2" variant="section">
            Filters
          </Heading>
        </div>

        {/* -------------------------------- */}
        {/* Scrollable Filter Content */}
        {/* -------------------------------- */}

        <div className="h-[calc(100vh-150px)] overflow-y-auto pb-[60px]">
          {filterSectionData.filters.map((filter) => {
            const isFilterOpen = openFilter.includes(
              filter.label,
            );

            return (
              <div
                key={filter.label}
                className={`pt-[13px] ${filter.label === "Price" ? "pb-[13px]" : ""}`}
              >
                {/* Filter Header */}

                <Button
                  variant="ghost"
                  className="flex w-full items-center !justify-between gap-2 border-b-[0.5px] border-border-light py-[15px] text-left"
                  onClick={() =>
                    handleOpen(filter.label)
                  }
                >
                  <Heading
                    as="h3"
                    variant="filter"
                  >
                    {filter.label}
                  </Heading>

                  <span>
                    {isFilterOpen ? (
                      <DownArrow />
                    ) : (
                      <UpArrow />
                    )}
                  </span>
                </Button>

                {/* Filter Content */}

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isFilterOpen
                      ? "max-h-[600px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {/* Price UI */}

                  {filter.label === "Price" && (
                    <PriceUI />
                  )}

                  {/* Other filter options */}

                  {filter.options.length > 0 && (
                    <div className="flex flex-col gap-[16px] py-[20px]">
                      <SearchBox
                        placeholder="Search"
                        className="h-[40px] w-full"
                        inputClassName="w-full bg-transparent tracking-[-0.44px] outline-none"
                      />

                      <div className="flex flex-col gap-[8px]">
                        {filter.options.map(
                          (option) => (
                            <div
                              key={option}
                              className="flex h-[24px] items-center gap-[8px]"
                            >
                              <CheckBox
                                label={option}
                              />

                              <Paragraph
                                as="p"
                                type="filterOptions"
                              >
                                {option}
                              </Paragraph>

                              <Paragraph
                                as="p"
                                type="filterCount"
                              >
                                {
                                  filter
                                    .options
                                    .length
                                }
                              </Paragraph>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}