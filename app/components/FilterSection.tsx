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
import Paragraph from "./ui/Paragraph";
import Input from "./ui/Input";
import { Search } from "../icons";
import { useFilters } from "@/redux/useFilters";
import { DEFAULT_CATEGORY, MAX_PRICE, MIN_PRICE } from "@/redux/slices/filterSlice";
import { useDispatch, useSelector } from "@/redux/hooks";
import { getCategories } from "@/redux/slices/productSlice";

const extraFilters = [
  {
    key: "brand",
    label: "Brand",
    options: ["Apple", "Samsung", "Realme", "Oppo", "Huawei", "Nokia"],
    multiple: true,
  },
  {
    key: "rating",
    label: "Rating",
    options: ["4", "3", "2", "1"],
    multiple: false,
  },
  {
    key: "availability",
    label: "Availability",
    options: ["in-stock", "low-stock"],
    multiple: false,
  },
  {
    key: "discount",
    label: "Discount",
    options: ["10", "20", "30"],
    multiple: false,
  },
];

function formatCategory(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatOption(key: string, option: string) {
  if (key === "rating") return `${option}★ & above`;
  if (key === "availability") {
    return option === "in-stock" ? "In Stock" : "Low Stock";
  }
  if (key === "discount") return `${option}% & above`;
  return option;
}

function FilterSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-[40px] w-full items-center gap-2 rounded-[8px] bg-surface p-[12px]">
      <Search />
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent tracking-[-0.44px] outline-none"
      />
    </div>
  );
}

function PriceFilter() {
  const { filters, applyFilters } = useFilters();
  const urlMin = filters.minPrice ?? MIN_PRICE;
  const urlMax = filters.maxPrice ?? MAX_PRICE;
  const [minPrice, setMinPrice] = useState(urlMin);
  const [maxPrice, setMaxPrice] = useState(urlMax);

  useEffect(() => {
    setMinPrice(urlMin);
    setMaxPrice(urlMax);
  }, [urlMin, urlMax]);

  const applyPrice = (min: number, max: number) => {
    applyFilters({
      minPrice: min <= MIN_PRICE ? null : min,
      maxPrice: max >= MAX_PRICE ? null : max,
    });
  };

  const handleMinChange = (value: number) => {
    const next = Math.min(Math.max(value, MIN_PRICE), maxPrice - 1);
    setMinPrice(next);
    applyPrice(next, maxPrice);
  };

  const handleMaxChange = (value: number) => {
    const next = Math.max(Math.min(value, MAX_PRICE), minPrice + 1);
    setMaxPrice(next);
    applyPrice(minPrice, next);
  };

  const minPercent = ((minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPercent = ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="flex w-full flex-col gap-[12px] pt-[16px]">
      <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-[400] leading-[1] text-muted-light">
          From
        </span>
        <span className="text-[14px] font-[400] leading-[1] text-muted-light">
          To
        </span>
      </div>
      <div className="flex w-full items-center justify-between gap-[8px]">
        <Input
          type="text"
          placeholder="0"
          value={String(minPrice)}
          onChange={(e) => {
            const value = Number(e.target.value.replace(/\s/g, ""));
            if (!Number.isNaN(value)) handleMinChange(value);
          }}
          inputClassName=""
          className="h-[40px] w-[109px] min-w-[109px] rounded-[4px] border border-[#D4D4D4] bg-transparent px-[12px] text-[14px] font-[400] text-primary outline-none"
        />
        <span className="h-[1px] w-[20px] shrink-0 bg-[#E7E7E7]" />
        <Input
          type="text"
          placeholder="5000"
          value={String(maxPrice)}
          onChange={(e) => {
            const value = Number(e.target.value.replace(/\s/g, ""));
            if (!Number.isNaN(value)) handleMaxChange(value);
          }}
          inputClassName=""
          className="h-[40px] w-[109px] min-w-[109px] rounded-[4px] border border-[#D4D4D4] bg-transparent px-[12px] text-end text-[14px] font-[400] text-primary outline-none"
        />
      </div>
      <div className="relative mt-[16px] h-[24px] w-full">
        <div className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 rounded-full bg-[#D4D4D4]" />
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

function CategoryOptions({ categories }: { categories: string[] }) {
  const { filters, applyFilters } = useFilters();
  const [search, setSearch] = useState("");

  const isChecked = (slug: string) => {
    if (filters.category === "all") return false;
    if (!filters.category) return slug === DEFAULT_CATEGORY;
    return filters.category === slug;
  };

  const visible = categories.filter((option) =>
    formatCategory(option).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-[16px] pt-[16px]">
      <FilterSearch value={search} onChange={setSearch} />
      <div className="flex max-h-[280px] flex-col gap-[8px] overflow-y-auto">
        {visible.map((option) => (
          <div
            key={option}
            className="flex h-[24px] items-center gap-[8px] text-left"
          >
            <CheckBox
              label={option}
              checked={isChecked(option)}
              onChange={(checked) =>
                applyFilters({
                  category: checked ? option : "all",
                  q: checked ? "" : filters.q,
                })
              }
            />
            <Paragraph as="p" type="filterOptions">
              {formatCategory(option)}
            </Paragraph>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterOptions({
  filterKey,
  options,
}: {
  filterKey: string;
  options: string[];
  multiple: boolean;
}) {
  const { filters, applyFilters } = useFilters();
  const [search, setSearch] = useState("");
  const selected =
    filterKey === "brand"
      ? filters.brand.split(",").filter(Boolean)
      : filterKey === "rating"
        ? filters.rating !== null
          ? [String(filters.rating)]
          : []
        : filterKey === "discount"
          ? filters.discount !== null
            ? [String(filters.discount)]
            : []
          : filters.availability
            ? [filters.availability]
            : [];

  const visible = options.filter((option) =>
    formatOption(filterKey, option).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-[16px] pt-[16px]">
      <FilterSearch value={search} onChange={setSearch} />
      <div className="flex max-h-[220px] flex-col gap-[8px] overflow-y-auto">
        {visible.map((option) => (
          <div
            key={option}
            className="flex h-[24px] items-center gap-[8px] text-left"
          >
            <CheckBox
              label={option}
              checked={selected.includes(option)}
              onChange={(checked) => {
                if (filterKey === "brand") {
                  const next = checked
                    ? [...selected, option]
                    : selected.filter((item) => item !== option);
                  applyFilters({ brand: next.join(",") });
                  return;
                }
                if (filterKey === "rating") {
                  applyFilters({ rating: checked ? Number(option) : null });
                  return;
                }
                if (filterKey === "discount") {
                  applyFilters({ discount: checked ? Number(option) : null });
                  return;
                }
                applyFilters({
                  availability: checked ? option : "",
                });
              }}
            />
            <Paragraph as="p" type="filterOptions">
              {formatOption(filterKey, option)}
            </Paragraph>
          </div>
        ))}
      </div>
    </div>
  );
}

function useCategories(serverCategories: string[] = []) {
  const dispatch = useDispatch();
  const storedCategories = useSelector((state) => state.products.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  if (serverCategories.length > 0) return serverCategories;
  return Array.isArray(storedCategories) ? storedCategories : [];
}

function FilterList({
  categories,
  openFilters,
  onToggle,
  allowClosePrice = true,
}: {
  categories: string[];
  openFilters: string[];
  onToggle: (label: string) => void;
  allowClosePrice?: boolean;
}) {
  const filters = [
    { label: "Price", key: "price" },
    { label: "Category", key: "category" },
    ...extraFilters.map((filter) => ({
      label: filter.label,
      key: filter.key,
    })),
  ];

  return (
    <>
      {filters.map((filter) => {
        const isOpen = openFilters.includes(filter.label);
        const extra = extraFilters.find((item) => item.key === filter.key);

        return (
          <div key={filter.label} className="pt-[13px]">
            <Button
              variant="ghost"
              className="flex w-full items-center !justify-between gap-2 border-b-[0.5px] border-border-light py-[12px] text-left"
              onClick={() => {
                if (!allowClosePrice && filter.label === "Price") return;
                onToggle(filter.label);
              }}
            >
              <Heading as="h3" variant="filter">
                {filter.label}
              </Heading>
              <span>{isOpen ? <DownArrow /> : <UpArrow />}</span>
            </Button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {filter.key === "price" && <PriceFilter />}
              {filter.key === "category" && (
                <CategoryOptions categories={categories} />
              )}
              {extra && (
                <FilterOptions
                  filterKey={extra.key}
                  options={extra.options}
                  multiple={extra.multiple}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function FilterSectionDesktop({
  categories = [],
}: {
  categories?: string[];
}) {
  const [openFilter, setOpenFilter] = useState<string | null>("Category");
  const categoryList = useCategories(categories);

  return (
    <div className="flex flex-col gap-[10px]">
      <FilterList
        categories={categoryList}
        openFilters={openFilter ? [openFilter] : []}
        onToggle={(label) =>
          setOpenFilter((prev) => (prev === label ? null : label))
        }
      />
    </div>
  );
}

type FilterSectionMobileProps = {
  isOpen: boolean;
  onClose: () => void;
  categories?: string[];
};

export function FilterSectionMobile({
  isOpen,
  onClose,
  categories = [],
}: FilterSectionMobileProps) {
  const [openFilter, setOpenFilter] = useState<string[]>(["Price"]);
  const categoryList = useCategories(categories);

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

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-[88px] z-[110] h-[calc(100vh-88px)] w-full max-w-full bg-secondary px-[17px] transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-start gap-x-[16px] py-[15.5px] pt-[31px]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center"
            aria-label="Close filters"
          >
            <LeftArrow width="24" height="24" />
          </button>
          <Heading as="h2" variant="section">
            Filters
          </Heading>
        </div>
        <div className="h-[calc(100vh-150px)] overflow-y-auto pb-[60px]">
          <FilterList
            categories={categoryList}
            openFilters={openFilter}
            allowClosePrice={false}
            onToggle={(label) =>
              setOpenFilter((prev) =>
                prev.includes(label)
                  ? prev.filter((item) => item !== label)
                  : [...prev, label]
              )
            }
          />
        </div>
      </div>
    </>
  );
}
