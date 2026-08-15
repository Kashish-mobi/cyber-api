import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { store } from "@/redux/store";
import { getProducts, searchProducts, getCategories } from "@/redux/slices/productSlice";
import { parseFilters, setFilters } from "@/redux/slices/filterSlice";

export const metadata: Metadata = {
  title: "Products — CyberStore",
  description:
    "Browse our full catalog of smartphones, laptops, and accessories.",
};

const LIMIT = 12;

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    rating?: string;
    availability?: string;
    discount?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseFilters(params);
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

  const categoriesResult = await store.dispatch(getCategories());
  if (getCategories.fulfilled.match(categoriesResult)) {
    categories = categoriesResult.payload || [];
  }

  if (filters.q) {
    const result = await store.dispatch(
      searchProducts({
        ...filters,
        searchTerm: filters.q,
        limit: LIMIT,
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
        limit: LIMIT,
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
      limit={LIMIT}
      categories={categories}
    />
  );
}
