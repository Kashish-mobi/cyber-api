import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { store } from "@/redux/store";
import { getProducts, searchProducts } from "@/redux/slices/productSlice";
import {
  filtersFromSearchParams,
  paramsToSearchParams,
  PAGE_SIZE,
  setFilters,
} from "@/redux/slices/filterSlice";
import { getData } from "@/api/api";

export const metadata: Metadata = {
  title: "Products — CyberStore",
  description:
    "Browse our full catalog of smartphones, laptops, and accessories.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = filtersFromSearchParams(paramsToSearchParams(params));
  store.dispatch(setFilters(filters));

  let products: Array<{
    id: number;
    title: string;
    brand?: string;
    category?: string;
    price: number;
    thumbnail: string;
  }> = [];
  let totalProducts = 0;
  let categories: string[] = [];

  try {
    const list = await getData("/products/category-list");
    categories = Array.isArray(list) ? list : [];
  } catch {
    categories = [];
  }

  if (filters.q) {
    const result = await store.dispatch(
      searchProducts({
        ...filters,
        limit: PAGE_SIZE,
      })
    );

    if (searchProducts.fulfilled.match(result)) {
      products = result.payload.products;
      totalProducts = result.payload.total;
    }
  } else {
    const result = await store.dispatch(
      getProducts({
        ...filters,
        limit: PAGE_SIZE,
      })
    );

    if (getProducts.fulfilled.match(result)) {
      products = result.payload.products;
      totalProducts = result.payload.total;
    }
  }

  return (
    <ProductsClient
      products={products}
      totalProducts={totalProducts}
      currentPage={filters.page}
      limit={PAGE_SIZE}
      categories={categories}
    />
  );
}
