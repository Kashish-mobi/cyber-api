import MainSection from "@/app/components/MainSection";
import FeatureSection from "@/app/components/FeatureSection";
import CategorySection from "@/app/components/CategorySection";
import PDPSection from "@/app/components/PDPSection";
import PopularSection from "@/app/components/PopularSection";
import DiscountedSection from "@/app/components/DiscountedSection";
import BannerSection from "@/app/components/BannerSection";
import homepage from "@/data/homepage.json";

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
