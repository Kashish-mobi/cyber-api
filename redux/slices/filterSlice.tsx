import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const DEFAULT_CATEGORY = "smartphones";
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
  category: DEFAULT_CATEGORY,
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

// Turn filters into one string for the URL:
// category=laptops,brand=Apple,brand=Samsung,rating=4
export function filtersToString(filter: Filters) {
  const parts: string[] = [];

  if (filter.q) parts.push(`q=${encodeURIComponent(filter.q)}`);
  if (filter.sortBy && filter.sortBy !== DEFAULT_SORT) {
    parts.push(`sortBy=${filter.sortBy}`);
  }
  if (filter.page > 1) parts.push(`page=${filter.page}`);
  if (filter.minPrice !== null) parts.push(`minPrice=${filter.minPrice}`);
  if (filter.maxPrice !== null) parts.push(`maxPrice=${filter.maxPrice}`);
  filter.brand.forEach((brand) => parts.push(`brand=${encodeURIComponent(brand)}`));
  if (filter.rating !== null) parts.push(`rating=${filter.rating}`);
  if (filter.availability) parts.push(`availability=${filter.availability}`);
  if (filter.discount !== null) parts.push(`discount=${filter.discount}`);

  return parts.join(",");
}

export function stringToFilters(value?: string | null): Filters {
  const filter: Filters = { ...defaultFilters };
  if (!value) return filter;

  value.split(",").forEach((part) => {
    const eq = part.indexOf("=");
    if (eq < 1) return;

    const key = part.slice(0, eq);
    const raw = decodeURIComponent(part.slice(eq + 1));

    if (key === "q") filter.q = raw;
    if (key === "sortBy") filter.sortBy = raw;
    if (key === "page") {
      const page = Number(raw);
      filter.page = page > 0 ? page : 1;
    }
    if (key === "minPrice") {
      const amount = Number(raw);
      filter.minPrice = Number.isNaN(amount) ? null : amount;
    }
    if (key === "maxPrice") {
      const amount = Number(raw);
      filter.maxPrice = Number.isNaN(amount) ? null : amount;
    }
    if (key === "brand") {
      filter.brand = [...filter.brand, raw];
    }
    if (key === "rating") {
      const amount = Number(raw);
      filter.rating = Number.isNaN(amount) ? null : amount;
    }
    if (key === "availability") filter.availability = raw;
    if (key === "discount") {
      const amount = Number(raw);
      filter.discount = Number.isNaN(amount) ? null : amount;
    }
  });

  return filter;
}

export function filtersToUrl(filter: Filters) {
  const value = filtersToString(filter);
  if (!value) return "";
  return `filter=${encodeURIComponent(value)}`;
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

export function getChips(filters: Filters): Chip[] {
  const chips: Chip[] = [];

  if (filters.q) chips.push({ key: "q", label: `Search: ${filters.q}` });
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    chips.push({
      key: "price",
      label: `$${filters.minPrice ?? MIN_PRICE} - $${filters.maxPrice ?? MAX_PRICE}`,
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
