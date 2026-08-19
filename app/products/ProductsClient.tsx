"use client";

import { useEffect, useState, type MouseEvent } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { FilterSectionDesktop, FilterSectionMobile } from "@/components/FilterSection";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import DropDown from "@/components/ui/DropDown";
import Paragraph from "@/components/ui/Paragraph";
import Pagination from "@/components/ui/Pagination";
import { FilterIcon, Cross } from "@/icons";
import AppImage from "@/components/ui/Image";
import { hideLoader } from "@/redux/loaderSlice";
import { store } from "@/redux/store";
import { useDispatch, useSelector } from "@/redux/hooks";
import { defaultFilters, getChips, setFilters } from "@/redux/slices/filterSlice";
import { setFiltered } from "@/redux/slices/productSlice";
import { getFiltersFromUrl, loadProducts, useFilters } from "@/redux/useFilters";

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
  onClearAll,
  className,
}: {
  chips: Chip[];
  onRemove: (key: string, value?: string) => void;
  onClearAll: () => void;
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
      <button
        type="button"
        className="flex items-center gap-[6px] rounded-full border border-red-200 bg-red-50 px-[12px] py-[6px] text-[12px] font-[500] text-red-600 hover:bg-red-100"
        onClick={onClearAll}
      >
        Clear all
        {/* <Cross onClick={(e: MouseEvent) => { e.stopPropagation(); onClearAll(); }} /> */}
      </button>
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
  const dispatch = useDispatch();
  const { filters, applyFilters, removeChip, filterText } = useFilters();
  const filtered = useSelector((state) => state.products.filtered);
  const clientProducts = useSelector((state) => state.products.products);
  const clientTotal = useSelector((state) => state.products.totalProducts);
  const clientPage = useSelector((state) => state.products.currentPage);

  const list = filtered ? clientProducts : products;
  const total = filtered ? clientTotal : totalProducts;
  const page = filtered ? clientPage : currentPage;
  const category = filters.category;
  const query = filters.q;
  const sortBy = filters.sortBy;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const chips = getChips(filters);

  const handleClearAll = () => {
    applyFilters(defaultFilters);
  };

  useEffect(() => {
    dispatch(setFiltered(false));
    dispatch(setFilters(getFiltersFromUrl()));

    const onBackOrForward = () => {
      const nextFilters = getFiltersFromUrl();
      dispatch(setFilters(nextFilters));
      loadProducts(dispatch, nextFilters);
    };

    window.addEventListener("popstate", onBackOrForward);
    return () => window.removeEventListener("popstate", onBackOrForward);
  }, [dispatch]);

  useEffect(() => {
    store.dispatch(hideLoader());
  }, [page, list]);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    applyFilters({ page: nextPage });
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
      label: category || query || "Products",
      href: `/products${filterText ? `?filter=${encodeURIComponent(filterText)}` : ""}`,
    },
  ]}
/>

        <ChipList
          chips={chips}
          onRemove={removeChip}
          onClearAll={handleClearAll}
          className="hidden flex-wrap gap-[8px] pt-[16px] lg:flex"
        />

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[32px] lg:pt-[24px] pt-[53px] lg:pb-[56px] pb-[45px] w-full">
          {/* Filter */}
          <div className="w-[256px] shrink-0 hidden lg:block">
            <FilterSectionDesktop categories={categories} />
          </div>
          <FilterSectionMobile
            isOpen={filterMenuOpen}
            onClose={() => setFilterMenuOpen(false)}
            categories={categories}
          />

          {/* Products */}
          <div className="w-full flex-1 flex flex-col lg:gap-[24px] gap-[20px]">
            <div className="flex h-auto w-full flex-row items-center gap-[12px] lg:h-[40px] md:justify-between">
              <Paragraph
                as="span"
                type="nav"
                className="text-muted-nav !tracking-[0.5px] hidden lg:block"
              >
                Selected Products:{" "}
                <span className="text-primary text-[20px] font-[600] leading-[24px] tracking-[0.5px]">
                  {total}
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
              onClearAll={handleClearAll}
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
                  {total}
                </span>
              </Paragraph>
            </div>
            <div className="grid gap-x-[16px] lg:gap-y-[26px] gap-y-[16px] grid-cols-2 xl:grid-cols-3 lg:pb-[18px] pb-[22px]">
              {list?.length > 0 ? list.map((item: Product) => (
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
            {list?.length <=0 && (
            <div className="flex justify-center items-center h-full">
                <AppImage src="/website/no-products.avif" alt="No products found" width={500} height={500} className="w-full h-full max-w-[500px] max-h-[500px]" />
              </div>
            )}
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={goToPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
