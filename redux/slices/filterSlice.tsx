import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const DEFAULT_CATEGORY = "smartphones";
export const DEFAULT_SORT = "rating-desc";
export const MIN_PRICE = 0;
export const MAX_PRICE = 5000;

export type FilterState = {
  q: string;
  category: string;
  page: number;
  sortBy: string;
  minPrice: number | null;
  maxPrice: number | null;
  brand: string;
  rating: number | null;
  availability: string;
  discount: number | null;
};

export const initialFilterState: FilterState = {
  q: "",
  category: DEFAULT_CATEGORY,
  page: 1,
  sortBy: DEFAULT_SORT,
  minPrice: null,
  maxPrice: null,
  brand: "",
  rating: null,
  availability: "",
  discount: null,
};

type FilterableProduct = {
  price: number;
  brand?: string;
  rating?: number;
  stock?: number;
  discountPercentage?: number;
};

export function parseFilters(values: {
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
}): FilterState {
  const page = Number(values.page);

  return {
    q: values.q?.trim() || "",
    category: values.category || DEFAULT_CATEGORY,
    page: page > 0 ? page : 1,
    sortBy: values.sortBy || DEFAULT_SORT,
    minPrice: values.minPrice ? Number(values.minPrice) : null,
    maxPrice: values.maxPrice ? Number(values.maxPrice) : null,
    brand: values.brand || "",
    rating: values.rating ? Number(values.rating) : null,
    availability: values.availability || "",
    discount: values.discount ? Number(values.discount) : null,
  };
}

export function parseFiltersFromSearchParams(searchParams: {
  get: (key: string) => string | null;
}): FilterState {
  return parseFilters({
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    page: searchParams.get("page") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    brand: searchParams.get("brand") || undefined,
    rating: searchParams.get("rating") || undefined,
    availability: searchParams.get("availability") || undefined,
    discount: searchParams.get("discount") || undefined,
  });
}

export function filtersToQuery(filters: FilterState) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.category === "all" || filters.category !== DEFAULT_CATEGORY) {
    params.set("category", filters.category);
  }
  if (filters.sortBy && filters.sortBy !== DEFAULT_SORT) {
    params.set("sortBy", filters.sortBy);
  }
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.rating !== null) params.set("rating", String(filters.rating));
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.discount !== null) params.set("discount", String(filters.discount));

  return params.toString();
}

export function applyProductFilters<T extends FilterableProduct>(
  products: T[],
  filters: FilterState
): T[] {
  let result = products;

  if (filters.minPrice !== null) {
    result = result.filter((item) => item.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== null) {
    result = result.filter((item) => item.price <= filters.maxPrice!);
  }
  if (filters.brand) {
    const brands = filters.brand.split(",").filter(Boolean);
    result = result.filter((item) => item.brand && brands.includes(item.brand));
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

export type FilterChip = {
  key: string;
  label: string;
  value?: string;
};

export function withFilterRemoved(
  filters: FilterState,
  key: string,
  value?: string
): FilterState {
  const next = { ...filters, page: 1 };

  if (key === "category") next.category = "all";
  if (key === "q") next.q = "";
  if (key === "price") {
    next.minPrice = null;
    next.maxPrice = null;
  }
  if (key === "brand") {
    next.brand = next.brand
      .split(",")
      .filter((item) => item && item !== value)
      .join(",");
  }
  if (key === "rating") next.rating = null;
  if (key === "availability") next.availability = "";
  if (key === "discount") next.discount = null;

  return next;
}

export function getFilterChips(filters: FilterState): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filters.category !== "all") {
    chips.push({
      key: "category",
      label: filters.category.replace(/-/g, " "),
    });
  }
  if (filters.q) chips.push({ key: "q", label: `Search: ${filters.q}` });
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    chips.push({
      key: "price",
      label: `$${filters.minPrice ?? MIN_PRICE} - $${filters.maxPrice ?? MAX_PRICE}`,
    });
  }
  filters.brand
    .split(",")
    .filter(Boolean)
    .forEach((brand) => {
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

function resetPage(state: FilterState, next: Partial<FilterState>) {
  Object.assign(state, next);
  if (next.page === undefined) state.page = 1;
}

const filterSlice = createSlice({
  name: "filters",
  initialState: initialFilterState,
  reducers: {
    setFilters: (_state, action: PayloadAction<FilterState>) => {
      return action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      resetPage(state, action.payload);
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.q = "";
      state.page = 1;
    },
    setPrice: (
      state,
      action: PayloadAction<{ minPrice: number; maxPrice: number }>
    ) => {
      const { minPrice, maxPrice } = action.payload;
      state.minPrice = minPrice <= MIN_PRICE ? null : minPrice;
      state.maxPrice = maxPrice >= MAX_PRICE ? null : maxPrice;
      state.page = 1;
    },
    setOptionFilter: (
      state,
      action: PayloadAction<{
        key: "brand" | "rating" | "availability" | "discount";
        value: string;
        checked: boolean;
        multiple: boolean;
      }>
    ) => {
      const { key, value, checked, multiple } = action.payload;

      if (key === "brand") {
        const selected = state.brand.split(",").filter(Boolean);
        const next = checked
          ? [...selected, value]
          : selected.filter((item) => item !== value);
        state.brand = next.join(",");
      } else if (key === "rating") {
        state.rating = checked ? Number(value) : null;
      } else if (key === "availability") {
        state.availability = checked ? value : "";
      } else if (key === "discount") {
        state.discount = checked ? Number(value) : null;
      }

      if (!multiple && !checked && key !== "brand") {
        // already cleared above
      }

      state.page = 1;
    },
    removeFilter: (
      state,
      action: PayloadAction<{ key: string; value?: string }>
    ) => {
      const { key, value } = action.payload;

      if (key === "category") state.category = "all";
      if (key === "q") state.q = "";
      if (key === "price") {
        state.minPrice = null;
        state.maxPrice = null;
      }
      if (key === "brand") {
        const next = state.brand
          .split(",")
          .filter((item) => item && item !== value);
        state.brand = next.join(",");
      }
      if (key === "rating") state.rating = null;
      if (key === "availability") state.availability = "";
      if (key === "discount") state.discount = null;

      state.page = 1;
    },
  },
});

export const {
  setFilters,
  updateFilters,
  setCategory,
  setPrice,
  setOptionFilter,
  removeFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
