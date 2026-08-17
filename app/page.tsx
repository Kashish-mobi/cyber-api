import type { Metadata } from "next";
import MainSection from "@/components/MainSection";
import FeatureSection from "@/components/FeatureSection";
import CategorySection from "@/components/CategorySection";
import PDPSection from "@/components/PDPSection";
import PopularSection from "@/components/PopularSection";
import DiscountedSection from "@/components/DiscountedSection";
import BannerSection from "@/components/BannerSection";
import homepage from "@/data/homepage.json";

export const metadata: Metadata = {
  title: "CyberStore — Tech & Gadgets",
  description: "Shop the latest smartphones, laptops, accessories and more at CyberStore.",
};

export default function Page() {
  const { discounts, ui } = homepage;

  return (
    <div>
      <MainSection />
      <FeatureSection />
      <CategorySection />
      <PDPSection />
      <PopularSection />
      <DiscountedSection
        title={discounts.title}
        items={discounts.items}
        buttonText={discounts.buyNowLabel ?? ui.buyNow}
        currencySymbol={ui.currencySymbol}
      />
      <BannerSection />
    </div>
  );
}
