import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { store } from "@/redux/store";
import { getProducts, searchProducts } from "@/redux/slices/productSlice";

export const metadata: Metadata = {
  title: "Products — CyberStore",
  description:
    "Browse our full catalog of smartphones, laptops, and accessories.",
};

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const searchTerm = q?.trim();

  const result = searchTerm
    ? await store.dispatch(searchProducts(searchTerm))
    : await store.dispatch(getProducts());
    const totalProducts = result.payload?.total;
    console.log("totalProducts kashish", totalProducts);


  const relatedProducts = result.payload?.products
    ?.filter((item: any) => item.id !== result.payload?.product?.id)
    .slice(0, 4)
    .map((item: any) => ({
      ...item,
      id: item.id,
      title: item.title,
      brand: item.brand || item.category || "",
      price: item.price,
      thumbnail: item.thumbnail || item.images?.[0] || "",
    }));

  return (
    <ProductsClient
      products={result.payload?.products ?? []}
      relatedProducts={relatedProducts}
      totalProducts={totalProducts}
    />
  );
}
