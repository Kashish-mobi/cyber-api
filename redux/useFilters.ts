"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useDispatch, useSelector } from "./hooks";

import {
  defaultFilters,
  filtersToQueryString,
  filtersFromSearchParams,
  removeFilter,
  setFilters,
  PAGE_SIZE,
  type Filters,
} from "./slices/filterSlice";

import { getProducts, setFiltered } from "./slices/productSlice";

export function getFiltersFromUrl() {
  if (typeof window === "undefined") return { ...defaultFilters };

  return filtersFromSearchParams(new URLSearchParams(window.location.search));
}

export function loadProducts(
  dispatch: ReturnType<typeof useDispatch>,
  filters: Filters
) {
  dispatch(setFiltered(true));
  dispatch(getProducts({ ...filters, limit: PAGE_SIZE }));
}

export function useFilters() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useSelector((state) => state.filters.filter);

  const applyFilters = (changes: Partial<Filters>) => {
    const newFilters = {
      ...filters,
      ...changes,
      page: changes.page ?? 1,
    };

    dispatch(setFilters(newFilters));

    const query = filtersToQueryString(newFilters);
    const url = query ? `/products?${query}` : "/products";

    if (pathname === "/products") {
      window.history.pushState(null, "", url);
      loadProducts(dispatch, newFilters);
    } else {
      router.push(url);
    }
  };

  const removeChip = (key: string, value?: string) => {
    applyFilters(removeFilter(filters, key, value));
  };

  return {
    filters,
    applyFilters,
    removeChip,
    queryString: filtersToQueryString(filters),
  };
}
