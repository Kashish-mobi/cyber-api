"use client";
import { useState } from "react";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import { FilterSectionDesktop } from "@/app/components/FilterSection";
import { FilterSectionMobile } from "@/app/components/FilterSection";
import Heading from "../components/ui/Heading";
import ProductCard from "../components/ui/ProductCard";
import productsPageData from "@/data/productsPage.json";
import Button from "../components/ui/Button";
import DropDown from "../components/ui/DropDown";
import Paragraph from "../components/ui/Paragraph";
import Pagination from "@/app/components/ui/Pagination";
import { FilterIcon } from "../icons";

type Product = {
  id: number;
  title: string;
  title2: string;
  price: number;
  image: string;
};

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="flex justify-center">
    <div className="container">
      <BreadCrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalog", href: "/shop" },
          { label: "Smartphones", href: "/products" },
        ]}
      />

      {/* <Heading
        as="h1"
        variant="section"
        className="mb-[32px] tracking-normal"
      >
        {productsPageData.title}
      </Heading> */}

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[32px] lg:pt-[24px] pt-[53px] lg:pb-[56px] pb-[45px] w-full">
        {/* Filter */}
        <div className=" w-[256px] shrink-0 hidden lg:block">
          <FilterSectionDesktop />
        </div>
        <FilterSectionMobile
  isOpen={filterMenuOpen}
  onClose={() => setFilterMenuOpen(false)}
/>
        {/* Products */}
        <div className="w-full flex-1 flex flex-col lg:gap-[24px] gap-[20px]">
          <div className="w-full h-[40px] flex flex-row  gap-[16px] items-center justify-between">
            <Paragraph
              as="span"
              type="nav"
              className="text-muted-nav !tracking-[0.5px] hidden lg:block"
            >
              Selected Products:{" "}
              <span className="text-primary text-[20px] font-[600] leading-[24px] tracking-[0.5px] ">
                85
              </span>
            </Paragraph>
            <Button variant="dark" className="lg:hidden flex !justify-between items-center gap-x-[8px] !min-w-0 !border-[#D4D4D4] !border-[0.5px] !w-1/2 !p-[16px]" onClick={() => setFilterMenuOpen(true)}>
              <Paragraph as="span" type="nav" className="flex !justify-between items-center gap-x-[8px] !tracking-[-0.7px] ">Filters
              </Paragraph>
              <FilterIcon />
            </Button>
            <DropDown
              options={[
                "By rating",
                "Oldest",
                "Price: Low to High",
                "Price: High to Low",
              ]}
              selected="By rating"
              className="!w-1/2"
            />
          </div>
          <div className="pt-[28px] lg:hidden">
          <Paragraph
              as="span"
              type="nav"
              className="text-muted-nav tracking-[1.3px] "
            >
              Product Result:{" "}
              <span className="text-primary text-[20px] font-[600] leading-[24px]">
                85
              </span>
            </Paragraph>
          </div>
          <div className="grid  gap-x-[16px] lg:gap-y-[26px] gap-y-[16px] grid-cols-2 xl:grid-cols-3 lg:pb-[18px] pb-[22px]">
            {productsPageData.items.map((item: Product) => (
              <ProductCard
                key={item.id}
                id={item.id.toString()}
                title={item.title}
                title2={item.title2}
                price={item.price}
                image={item.image}
                buttonText="Buy Now"
              />
            ))}
          </div>
          <Pagination
            totalPages={12}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
    </div>
  );
}
