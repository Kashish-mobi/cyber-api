"use client";

import { useEffect, useState, type MouseEvent } from "react";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import { FilterSectionDesktop, FilterSectionMobile } from "@/app/components/FilterSection";
import ProductCard from "@/app/components/ui/ProductCard";
import Button from "@/app/components/ui/Button";
import DropDown from "@/app/components/ui/DropDown";
import Paragraph from "@/app/components/ui/Paragraph";
import Pagination from "@/app/components/ui/Pagination";
import { FilterIcon, Cross } from "@/app/icons";
import AppImage from "@/app/components/ui/Image";
import { hideLoader } from "@/redux/loaderSlice";
import { store } from "@/redux/store";
import { useProductFilters } from "@/redux/useProductFilters";
import { getFilterChips } from "@/redux/slices/filterSlice";

const SORT_LABELS: Record<string, string> = {
  "rating-desc": "By rating : High to Low",
  "rating-asc": "By rating : Low to High",
  "price-asc": "By price : Low to High",
  "price-desc": "By price : High to Low",
};

const SORT_VALUES: Record<string, string> = {
  "By rating : High to Low": "rating-desc",
  "By rating : Low to High": "rating-asc",
  "By price : Low to High": "price-asc",
  "By price : High to Low": "price-desc",
};

type Chip = {
  key: string;
  label: string;
  value?: string;
};

function ChipList({
  chips,
  onRemove,
  className,
}: {
  chips: Chip[];
  onRemove: (key: string, value?: string) => void;
  className: string;
}) {
  if (chips.length === 0) return null;

  return (
    <div className={className}>
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value || chip.label}`}
          type="button"
          className="flex items-center gap-[6px] rounded-full border border-border-light bg-surface px-[12px] py-[6px] text-[12px] font-[500] capitalize"
          onClick={() => onRemove(chip.key, chip.value)}
        >
          {chip.label}
          <Cross
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              onRemove(chip.key, chip.value);
            }}
          />
        </button>
      ))}
    </div>
  );
}

type Product = {
  id: number;
  title: string;
  brand?: string;
  category?: string;
  price: number;
  thumbnail: string;
};

export default function ProductsClient({
  products,
  totalProducts,
  currentPage,
  limit,
  categories = [],
}: {
  products: Product[];
  relatedProducts?: Product[];
  totalProducts: number;
  currentPage: number;
  limit: number;
  categories?: string[];
}) {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const { filters, applyFilters, removeChip } = useProductFilters();
  const category = filters.category;
  const query = filters.q;
  const sortBy = filters.sortBy;
  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
  const chips = getFilterChips(filters);

  useEffect(() => {
    store.dispatch(hideLoader());
  }, [currentPage, products]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    applyFilters({ page });
  };

  const goToSort = (option: string) => {
    applyFilters({ sortBy: SORT_VALUES[option] });
  };

  return (
    <div className="flex justify-center">
      <div className="container">
      <BreadCrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/products" },
    {
      label: category === "all" ? query || "Products" : category || query || "Products",
      href: `/products${category && category !== "all" ? `?category=${category}` : query ? `?q=${query}` : ""}`,
    },
  ]}
/>

        <ChipList
          chips={chips}
          onRemove={removeChip}
          className="hidden flex-wrap gap-[8px] pt-[16px] lg:flex"
        />

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[32px] lg:pt-[24px] pt-[53px] lg:pb-[56px] pb-[45px] w-full">
          {/* Filter */}
          <div className="w-[256px] shrink-0 hidden lg:block">
            <FilterSectionDesktop categories={categories} />
          </div>
          <FilterSectionMobile
            isOpen={filterMenuOpen}
            onCloseAction={() => setFilterMenuOpen(false)}
            categories={categories}
          />

          {/* Products */}
          <div className="w-full flex-1 flex flex-col lg:gap-[24px] gap-[20px]">
            <div className="flex h-auto w-full flex-row items-center gap-[12px] lg:h-[40px]">
              <Paragraph
                as="span"
                type="nav"
                className="text-muted-nav !tracking-[0.5px] hidden lg:block"
              >
                Selected Products:{" "}
                <span className="text-primary text-[20px] font-[600] leading-[24px] tracking-[0.5px]">
                  {totalProducts}
                </span>
              </Paragraph>
              <Button
                variant="dark"
                className="lg:hidden flex !h-[56px] !justify-between items-center gap-x-[8px] !min-w-0 !border-[#D4D4D4] !border-[0.5px] !w-1/2 !p-[16px]"
                onClick={() => setFilterMenuOpen(true)}
              >
                <Paragraph as="span" type="nav" className="flex !justify-between items-center gap-x-[8px] !tracking-[-0.7px]">
                  Filters
                </Paragraph>
                <FilterIcon />
              </Button>
              <DropDown
                options={[
                  "By rating : High to Low",
                  "By rating : Low to High",
                  "By price : Low to High",
                  "By price : High to Low",
                ]}
                selected={SORT_LABELS[sortBy] || "By rating : High to Low"}
                className="w-1/2 lg:w-auto lg:min-w-[256px]"
                onSelect={goToSort}
              />
            </div>
            <ChipList
              chips={chips}
              onRemove={removeChip}
              className="relative z-0 flex w-full overflow-x-scroll gap-[8px] lg:hidden"
            />
            <div className="pt-[28px] lg:hidden">
              <Paragraph
                as="span"
                type="nav"
                className="text-muted-nav tracking-[1.3px]"
              >
                Product Result:{" "}
                <span className="text-primary text-[20px] font-[600] leading-[24px]">
                  {totalProducts}
                </span>
              </Paragraph>
            </div>
            <div className="grid gap-x-[16px] lg:gap-y-[26px] gap-y-[16px] grid-cols-2 xl:grid-cols-3 lg:pb-[18px] pb-[22px]">
              {products?.length > 0 ? products.map((item: Product) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  brand={item.brand || item.category || ""}
                  price={item.price}
                  thumbnail={item.thumbnail}
                  buttonText="View Product"
                />
              )) : 
             null
              }

            </div>
            {products?.length <=0 && (
            <div className="flex justify-center items-center h-full">
                <AppImage src="/website/no-products.avif" alt="No products found" width={500} height={500} className="w-full h-full max-w-[500px] max-h-[500px]" />
              </div>
            )}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={goToPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
