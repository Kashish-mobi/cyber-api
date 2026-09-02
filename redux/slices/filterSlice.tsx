import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { currencySign } from "@/lib/currency";

export const DEFAULT_SORT = "rating-desc";
export const MIN_PRICE = 0;
export const MAX_PRICE = 5000;
export const PAGE_SIZE = 12;

export type Filters = {
  q: string;
  category: string;
  page: number;
  sortBy: string;
  minPrice: number | null;
  maxPrice: number | null;
  brand: string[];
  rating: number | null;
  availability: string;
  discount: number | null;
};

export const defaultFilters: Filters = {
  q: "",
  category: "",
  page: 1,
  sortBy: DEFAULT_SORT,
  minPrice: null,
  maxPrice: null,
  brand: [],
  rating: null,
  availability: "",
  discount: null,
};

type Product = {
  price: number;
  brand?: string;
  rating?: number;
  stock?: number;
  discountPercentage?: number;
};

function formatCategory(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// Build URL like: ?q=apple&category=smartphones&sortBy=price-asc&brand=Apple
export function filtersToQueryString(filters: Filters) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.sortBy && filters.sortBy !== DEFAULT_SORT) {
    params.set("sortBy", filters.sortBy);
  }
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
  filters.brand.forEach((brand) => params.append("brand", brand));
  if (filters.rating !== null) params.set("rating", String(filters.rating));
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.discount !== null) params.set("discount", String(filters.discount));

  return params.toString();
}

// Read filters back from URL search params
export function filtersFromSearchParams(searchParams: URLSearchParams): Filters {
  const filters: Filters = { ...defaultFilters };

  const q = searchParams.get("q");
  if (q) filters.q = q;

  const category = searchParams.get("category");
  if (category) filters.category = category;

  const sortBy = searchParams.get("sortBy");
  if (sortBy) filters.sortBy = sortBy;

  const pageRaw = searchParams.get("page");
  if (pageRaw !== null) {
    const page = Number(pageRaw);
    if (page > 0) filters.page = page;
  }

  const minPriceRaw = searchParams.get("minPrice");
  if (minPriceRaw !== null) {
    const minPrice = Number(minPriceRaw);
    if (!Number.isNaN(minPrice)) filters.minPrice = minPrice;
  }

  const maxPriceRaw = searchParams.get("maxPrice");
  if (maxPriceRaw !== null) {
    const maxPrice = Number(maxPriceRaw);
    if (!Number.isNaN(maxPrice)) filters.maxPrice = maxPrice;
  }

  filters.brand = searchParams.getAll("brand");

  const ratingRaw = searchParams.get("rating");
  if (ratingRaw !== null) {
    const rating = Number(ratingRaw);
    if (!Number.isNaN(rating)) filters.rating = rating;
  }

  const availability = searchParams.get("availability");
  if (availability) filters.availability = availability;

  const discountRaw = searchParams.get("discount");
  if (discountRaw !== null) {
    const discount = Number(discountRaw);
    if (!Number.isNaN(discount)) filters.discount = discount;
  }

  return filters;
}

export function paramsToSearchParams(
  params: Record<string, string | string[] | undefined>
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.set(key, value);
  });

  return searchParams;
}

export function filterProducts<T extends Product>(
  products: T[],
  filters: Filters
): T[] {
  let result = products;

  if (filters.minPrice !== null) {
    result = result.filter((item) => item.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== null) {
    result = result.filter((item) => item.price <= filters.maxPrice!);
  }
  if (filters.brand.length) {
    result = result.filter((item) => item.brand && filters.brand.includes(item.brand));
  }
  if (filters.rating !== null) {
    result = result.filter((item) => (item.rating || 0) >= filters.rating!);
  }
  if (filters.availability === "in-stock") {
    result = result.filter((item) => (item.stock || 0) > 10);
  }
  if (filters.availability === "low-stock") {
    result = result.filter(
      (item) => (item.stock || 0) > 0 && (item.stock || 0) <= 10
    );
  }
  if (filters.discount !== null) {
    result = result.filter(
      (item) => (item.discountPercentage || 0) >= filters.discount!
    );
  }

  return result;
}

export type Chip = {
  key: string;
  label: string;
  value?: string;
};

export function removeFilter(
  filters: Filters,
  key: string,
  value?: string
): Filters {
  const next = { ...filters, page: 1 };

  if (key === "q") next.q = "";
  if (key === "category") next.category = "";
  if (key === "price") {
    next.minPrice = null;
    next.maxPrice = null;
  }
  if (key === "brand") {
    next.brand = next.brand.filter((item) => item !== value);
  }
  if (key === "rating") next.rating = null;
  if (key === "availability") next.availability = "";
  if (key === "discount") next.discount = null;

  return next;
}

export function getChips(
  filters: Filters,
  showPrice?: (price: number) => string
): Chip[] {
  const chips: Chip[] = [];
  const format = showPrice ?? ((price: number) => currencySign(price, "dollar"));

  if (filters.q) chips.push({ key: "q", label: `Search: ${filters.q}` });
  if (filters.category) {
    chips.push({ key: "category", label: formatCategory(filters.category) });
  }
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    chips.push({
      key: "price",
      label: `${format(filters.minPrice ?? MIN_PRICE)} - ${format(filters.maxPrice ?? MAX_PRICE)}`,
    });
  }
  filters.brand.forEach((brand) => {
    chips.push({ key: "brand", label: brand, value: brand });
  });
  if (filters.rating !== null) {
    chips.push({
      key: "rating",
      label: `${filters.rating}★ & above`,
    });
  }
  if (filters.availability) {
    chips.push({
      key: "availability",
      label: filters.availability === "in-stock" ? "In Stock" : "Low Stock",
    });
  }
  if (filters.discount !== null) {
    chips.push({
      key: "discount",
      label: `${filters.discount}% & above`,
    });
  }

  return chips;
}

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    filter: defaultFilters,
  },
  reducers: {
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filter = action.payload;
    },
  },
});

export const { setFilters } = filterSlice.actions;

export default filterSlice.reducer;
