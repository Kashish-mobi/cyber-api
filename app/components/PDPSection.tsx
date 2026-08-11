"use client";

import { useState } from "react";
import homepage from "@/data/homepage.json";
import ProductCard from "./ui/ProductCard";
import ProductGrid from "./ui/ProductGrid";
import Tabs from "./ui/Tabs";

const { products: productsData, ui } = homepage;
type TabId = keyof typeof productsData.products;

export default function PDPSection() {
  const { tabs, products } = productsData;
  const [activeTab, setActiveTab] = useState<TabId>("new-arrivals");

  return (
    <div className="w-full flex justify-center">
      <section className="container py-[56px]">
        <Tabs
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.name }))}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
        />

        <ProductGrid>
          {products[activeTab].map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              title2={"title2" in product ? product.title2 : undefined}
              price={product.price}
              image={product.image}
              buttonText={productsData.buyNowLabel ?? ui.buyNow}
              currencySymbol={ui.currencySymbol}
            />
          ))}
        </ProductGrid>
      </section>
    </div>
  );
}
