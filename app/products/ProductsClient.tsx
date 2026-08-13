"use client";

import { useState } from "react";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import { FilterSectionDesktop, FilterSectionMobile } from "@/app/components/FilterSection";
import ProductCard from "@/app/components/ui/ProductCard";
import productsPageData from "@/data/productsPage.json";
import Button from "@/app/components/ui/Button";
import DropDown from "@/app/components/ui/DropDown";
import Paragraph from "@/app/components/ui/Paragraph";
import Pagination from "@/app/components/ui/Pagination";
import { FilterIcon } from "@/app/icons";
import { useSearchParams } from "next/navigation";
  import AppImage from "@/app/components/ui/Image";
  import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Product = {
  id: number;
  title: string;
  brand?: string;
  category?: string;
  price: number;
  thumbnail: string;
};

export default function ProductsClient({ products, relatedProducts, totalProducts }: { products: Product[], relatedProducts: Product[], totalProducts: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const query = searchParams.get("q");
  return (
    <div className="flex justify-center">
      <div className="container">
      <BreadCrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/products" },
    {
      label: category || query || "Products",
      href: `/products${category ? `?category=${category}` : query ? `?q=${query}` : ""}`,
    },
  ]}
/>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[32px] lg:pt-[24px] pt-[53px] lg:pb-[56px] pb-[45px] w-full">
          {/* Filter */}
          <div className="w-[256px] shrink-0 hidden lg:block">
            <FilterSectionDesktop />
          </div>
          <FilterSectionMobile
            isOpen={filterMenuOpen}
            onClose={() => setFilterMenuOpen(false)}
          />

          {/* Products */}
          <div className="w-full flex-1 flex flex-col lg:gap-[24px] gap-[20px]">
            <div className="w-full h-[40px] flex flex-row gap-[16px] items-center justify-between">
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
                className="lg:hidden flex !justify-between items-center gap-x-[8px] !min-w-0 !border-[#D4D4D4] !border-[0.5px] !w-1/2 !p-[16px]"
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
                selected="By rating : High to Low"
                className="!w-1/2"
              />
            </div>
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
                  buttonText="Buy Now"
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
              totalPages={12}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
