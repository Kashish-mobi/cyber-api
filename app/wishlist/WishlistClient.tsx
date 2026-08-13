"use client";

import Heading from "../components/ui/Heading";
import ProductCard from "../components/ui/ProductCard";

const wishlistPageData = {
  title: "Wishlist",
  description: "Save your favorite products here and come back when you're ready.",
  items: [
    {
      id: 11,
      title: "Apple iPhone 14 Pro 512GB Gold (MQ233)",
      description:
        "Apple iPhone 14 Pro 512GB Gold (MQ233). A reliable product with quality build and everyday performance.",
      category: "smartphones",
      price: 1437,
      discountPercentage: 50,
      rating: 4.5,
      stock: 50,
      tags: ["smartphones", "apple"],
      brand: "Apple",
      sku: "SKU-11",
      weight: 1,
      dimensions: { width: 10, height: 15, depth: 5 },
      warrantyInformation: "1 year warranty",
      shippingInformation: "Ships in 1-2 business days",
      availabilityStatus: "In Stock",
      reviews: [],
      returnPolicy: "30 days return policy",
      minimumOrderQuantity: 1,
      meta: {
        createdAt: "2025-04-30T09:41:02.054Z",
        updatedAt: "2025-04-30T09:41:02.054Z",
        barcode: "1000000000011",
        qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
      },
      images: ["/website/discount/d1.png"],
      thumbnail: "/website/discount/d1.png",
    },
    {
      id: 12,
      title: "AirPods Max Silver Starlight Aluminium",
      description:
        "AirPods Max Silver Starlight Aluminium. A reliable product with quality build and everyday performance.",
      category: "mobile-accessories",
      price: 549,
      discountPercentage: 50,
      rating: 4.5,
      stock: 50,
      tags: ["headphones", "apple"],
      brand: "Apple",
      sku: "SKU-12",
      weight: 1,
      dimensions: { width: 10, height: 15, depth: 5 },
      warrantyInformation: "1 year warranty",
      shippingInformation: "Ships in 1-2 business days",
      availabilityStatus: "In Stock",
      reviews: [],
      returnPolicy: "30 days return policy",
      minimumOrderQuantity: 1,
      meta: {
        createdAt: "2025-04-30T09:41:02.054Z",
        updatedAt: "2025-04-30T09:41:02.054Z",
        barcode: "1000000000012",
        qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
      },
      images: ["/website/discount/d2.png"],
      thumbnail: "/website/discount/d2.png",
    },
    {
      id: 13,
      title: "Apple Watch Series 9 GPS 41mm Starlight Aluminium",
      description:
        "Apple Watch Series 9 GPS 41mm Starlight Aluminium. A reliable product with quality build and everyday performance.",
      category: "smartphones",
      price: 399,
      discountPercentage: 50,
      rating: 4.5,
      stock: 50,
      tags: ["watches", "apple"],
      brand: "Apple",
      sku: "SKU-13",
      weight: 1,
      dimensions: { width: 10, height: 15, depth: 5 },
      warrantyInformation: "1 year warranty",
      shippingInformation: "Ships in 1-2 business days",
      availabilityStatus: "In Stock",
      reviews: [],
      returnPolicy: "30 days return policy",
      minimumOrderQuantity: 1,
      meta: {
        createdAt: "2025-04-30T09:41:02.054Z",
        updatedAt: "2025-04-30T09:41:02.054Z",
        barcode: "1000000000013",
        qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
      },
      images: ["/website/discount/d3.png"],
      thumbnail: "/website/discount/d3.png",
    },
    {
      id: 14,
      title: "Apple iPhone 14 Pro 1TB Gold (MQ2V3)",
      description:
        "Apple iPhone 14 Pro 1TB Gold (MQ2V3). A reliable product with quality build and everyday performance.",
      category: "smartphones",
      price: 1499,
      discountPercentage: 50,
      rating: 4.5,
      stock: 50,
      tags: ["smartphones", "apple"],
      brand: "Apple",
      sku: "SKU-14",
      weight: 1,
      dimensions: { width: 10, height: 15, depth: 5 },
      warrantyInformation: "1 year warranty",
      shippingInformation: "Ships in 1-2 business days",
      availabilityStatus: "In Stock",
      reviews: [],
      returnPolicy: "30 days return policy",
      minimumOrderQuantity: 1,
      meta: {
        createdAt: "2025-04-30T09:41:02.054Z",
        updatedAt: "2025-04-30T09:41:02.054Z",
        barcode: "1000000000014",
        qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
      },
      images: ["/website/discount/d4.png"],
      thumbnail: "/website/discount/d4.png",
    },
  ],
};

export default function WishlistClient() {
  return (
    <div className="container pt-[63px] pb-[58px] 2xl:py-[80px]">
      <Heading as="h1" variant="section" className="mb-[32px] tracking-normal">
        {wishlistPageData.title}
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wishlistPageData.items.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            brand={item.brand}
            price={item.price}
            thumbnail={item.thumbnail}
            buttonText="Add to Cart"
            currencySymbol="$"
          />
        ))}
      </div>
    </div>
  );
}
