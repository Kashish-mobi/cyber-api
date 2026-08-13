import Breadcrumbs from "@/app/components/BreadCrumbs";
import ProductPurchase from "@/app/components/ProductPurchase";
import ProductDetails from "@/app/components/ProductDetails";
import ProductReviews from "@/app/components/ProductReviews";
import DiscountedSection from "@/app/components/DiscountedSection";
import Image from "@/app/components/ui/Image";

import { store } from "@/redux/store";
import {
  getProductsById,
  getProducts,
} from "@/redux/slices/productSlice";

import productData from "@/data/product.json";

export default async function ProductPage({
  params,
}) {
  const { id } = await params;

  // =========================================
  // 1. Get product + all products from API
  // =========================================

  const [result, result2] = await Promise.all([
    store.dispatch(getProductsById(Number(id))),
    store.dispatch(getProducts()),
  ]);

  // =========================================
  // 2. Handle API product error
  // =========================================

  if (getProductsById.rejected.match(result)) {
    return (
      <div className="flex justify-center items-center">
        <Image
          src="/website/404.png"
          alt="Product not found"
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // =========================================
  // 3. API product
  // =========================================

  const apiProduct = result.payload;

  // =========================================
  // 4. API products for related products
  // =========================================

  const apiProducts = getProducts.fulfilled.match(result2)
    ? result2.payload?.products || []
    : [];

  // Remove current product, shuffle, then take 4
  const relatedApiProducts = apiProducts
    .filter((item) => item.id !== apiProduct.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  // =========================================
  // 5. Merge API + JSON
  // =========================================

  const product = {
    // Start with JSON.
    // This makes sure all UI-required fields exist.
    ...productData,

    // =========================================
    // API values
    // =========================================

    id: apiProduct.id,

    name: apiProduct.title,

    description:
      apiProduct.description ||
      productData.description,

    price: apiProduct.price,

    rating:
      apiProduct.rating ??
      productData.rating,

    inStock:
      apiProduct.stock !== undefined
        ? apiProduct.stock > 0
        : productData.inStock,

    // =========================================
    // Images
    // =========================================

    thumbnail:
      apiProduct.thumbnail ||
      productData.images?.[0] ||
      "",

    images:
      apiProduct.images?.length > 0
        ? apiProduct.images
        : apiProduct.thumbnail
          ? [apiProduct.thumbnail]
          : productData.images,

    // =========================================
    // Original price
    // =========================================

    originalPrice:
      apiProduct.discountPercentage > 0
        ? apiProduct.price /
          (1 - apiProduct.discountPercentage / 100)
        : apiProduct.price,

    // =========================================
    // JSON UI data
    // =========================================

    currency: productData.currency,

    ui: productData.ui,

    colors: productData.colors,

    storage: productData.storage,

    selectedStorage:
      productData.selectedStorage,

    selectedColor:
      productData.selectedColor,

    specifications:
      productData.specifications,

    // =========================================
    // Delivery
    // API data first, JSON fallback
    // =========================================

    delivery: [
      {
        icon: "Delivery",

        title: "Shipping",

        time:
          apiProduct.shippingInformation ||
          productData.delivery?.[0]?.time ||
          "",
      },

      {
        icon: "Stock",

        title:
          apiProduct.availabilityStatus ||
          productData.delivery?.[1]?.title ||
          "In Stock",

        time:
          apiProduct.stock !== undefined
            ? `${apiProduct.stock} available`
            : productData.delivery?.[1]?.time || "",
      },

      {
        icon: "Guarentee",

        title: "Warranty",

        time:
          apiProduct.warrantyInformation ||
          productData.delivery?.[2]?.time ||
          "",
      },
    ],

    // =========================================
    // Details
    // =========================================

    details: {
      ...productData.details,

      description:
        apiProduct.description ||
        productData.details?.description ||
        "",
    },

    // =========================================
    // Reviews
    // =========================================

    reviews: {
      // Keep all other JSON review fields
      ...productData.reviews,

      // API rating
      rating:
        apiProduct.rating ??
        productData.reviews?.rating ??
        0,

      // API review count
      totalReviews:
        apiProduct.reviews?.length ??
        productData.reviews?.totalReviews ??
        0,

      // =========================================
      // Rating Breakdown
      // =========================================

      ratingBreakdown:
        apiProduct.reviews?.length > 0
          ? [
              {
                label: "Excellent",
                count: apiProduct.reviews.filter(
                  (review) =>
                    review.rating === 5
                ).length,
              },

              {
                label: "Good",
                count: apiProduct.reviews.filter(
                  (review) =>
                    review.rating === 4
                ).length,
              },

              {
                label: "Average",
                count: apiProduct.reviews.filter(
                  (review) =>
                    review.rating === 3
                ).length,
              },

              {
                label: "Below Average",
                count: apiProduct.reviews.filter(
                  (review) =>
                    review.rating === 2
                ).length,
              },

              {
                label: "Poor",
                count: apiProduct.reviews.filter(
                  (review) =>
                    review.rating === 1
                ).length,
              },
            ]
          : productData.reviews?.ratingBreakdown || [],

      // =========================================
      // Review items
      // =========================================

      items:
        apiProduct.reviews?.length > 0
          ? apiProduct.reviews.map(
              (
                review,
                index
              ) => ({
                id: index + 1,

                name:
                  review.reviewerName,

                rating:
                  review.rating,

                date: new Date(
                  review.date
                ).toLocaleDateString(),

                // Use JSON avatar if available
                avatar:
                  productData.reviews
                    ?.items?.[index]
                    ?.avatar || "",

                comment:
                  review.comment,

                // Use JSON review images if available
                images:
                  productData.reviews
                    ?.items?.[index]
                    ?.images || [],
              })
            )
          : productData.reviews?.items || [],
    },

    // =========================================
    // Related Products
    // API products first
    // JSON fallback
    // =========================================

    relatedProducts: {
      ...productData.relatedProducts,

      items:
        relatedApiProducts.length > 0
          ? relatedApiProducts.map((item) => ({
              ...item,
              id: item.id,
              title: item.title,
              brand: item.brand || item.category || "",
              price: item.price,
              thumbnail:
                item.thumbnail || item.images?.[0] || "",
            }))
          : productData.relatedProducts?.items || [],
    },
  };

  // =========================================
  // 6. Render
  // =========================================

  return (
    <div>

      {/* =====================================
          Product
      ====================================== */}

      <div className="flex flex-col justify-center items-center">
        <div className="container mx-auto">

          {/* Breadcrumbs */}

          <Breadcrumbs
            items={[
              {
                label: "Home",
                href: "/",
              },

              {
                label: "Catalog",
                href: "/products",
              },

              {
                label: product.category,
                href: `/products?category=${product.category}`,
              },

              {
                label: product.name,
                href: `/products/${product.id}`,
              },
            ]}
          />

          {/* Product Purchase */}

          <div className="py-[36px] md:py-[72px] lg:py-[112px]">
            <ProductPurchase
              product={product}
            />
          </div>

        </div>
      </div>

      {/* =====================================
          Product Details
      ====================================== */}

      <div className="bg-surface-soft md:py-[80px] py-[40px] flex justify-center">
        <div className="container mx-auto flex flex-col gap-[64px] md:gap-[80px]">

          <div className="bg-white md:py-[48px] py-[48px] px-[24px] md:px-[40px] rounded-[16px]">

            <ProductDetails
              title={product.details.title}
              description={
                product.details.description
              }
              sections={
                product.details.sections
              }
              viewMoreLabel={
                product.ui.viewMore
              }
            />

          </div>

        </div>
      </div>

      {/* =====================================
          Reviews
      ====================================== */}

      <div className="flex flex-col justify-center items-center">
        <div className="container md:py-[88px] py-[76px]">

          <ProductReviews
            title={product.reviews.title}

            rating={
              product.reviews.rating
            }

            totalReviews={
              product.reviews.totalReviews
            }

            ratingBreakdown={
              product.reviews.ratingBreakdown
            }

            items={
              product.reviews.items
            }

            viewMoreLabel={
              product.ui.viewMore
            }

            fromReviewsLabel={
              product.ui.fromReviews
            }
          />

        </div>
      </div>

      {/* =====================================
          Related Products
      ====================================== */}

      <div className="flex flex-col justify-center items-center">

        <DiscountedSection
          title={
            product.relatedProducts.title
          }

          items={
            product.relatedProducts.items
          }

          buttonText={
            product.ui.buyNow
          }

          currencySymbol={
            product.currency
          }
        />

      </div>

    </div>
  );
}