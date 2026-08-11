import productData from "@/data/product.json";
import Breadcrumbs from "@/app/components/BreadCrumbs";
import ProductPurchase from "@/app/components/ProductPurchase";
import ProductDetails from "@/app/components/ProductDetails";
import ProductReviews from "@/app/components/ProductReviews";
import DiscountedSection from "@/app/components/DiscountedSection";
export default function ProductPage() {
  const product = productData;

  return (
    <div>
    <div className="flex flex-col justify-center items-center">
      <div className="container mx-auto">
        <Breadcrumbs items={product.breadcrumbs} />

        <div className="py-[36px] md:py-[72px] lg:py-[112px]">
          <ProductPurchase product={product} />
        </div>
      </div>

      
    </div>
    <div className="bg-surface-soft md:py-[80px] py-[40px] flex justify-center">
    <div className="container mx-auto flex flex-col gap-[64px] md:gap-[80px]">
      <div className="bg-white md:py-[48px] py-[48px] px-[24px] md:px-[40px] rounded-[16px]">
        <ProductDetails
          title={product.details.title}
          description={product.details.description}
          sections={product.details.sections}
          viewMoreLabel={product.ui.viewMore}
        />
      </div>

    
    </div>
  </div>
  <div className="flex flex-col justify-center items-center">
    <div className="container md:py-[88px] py-[76px]">
      <ProductReviews
        title={product.reviews.title}
        rating={product.reviews.rating}
        totalReviews={product.reviews.totalReviews}
        ratingBreakdown={product.reviews.ratingBreakdown}
        items={product.reviews.items}
        viewMoreLabel={product.ui.viewMore}
        fromReviewsLabel={product.ui.fromReviews}
      />
    </div>
  </div>
  <div className="flex flex-col justify-center items-center">
    <DiscountedSection
      title={product.relatedProducts.title}
      items={product.relatedProducts.items}
      buttonText={product.ui.buyNow ?? "Buy Now"}
      currencySymbol={product.currency}
    />
      </div>
  </div>
  );
}
