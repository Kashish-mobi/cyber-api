"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  filtersToQuery,
  parseFiltersFromSearchParams,
  setFilters,
  withFilterRemoved,
  type FilterState,
} from "./slices/filterSlice";

export function useProductFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    dispatch(setFilters(parseFiltersFromSearchParams(searchParams)));
  }, [searchParams, dispatch]);

  const applyFilters = (next: Partial<FilterState>) => {
    const current = parseFiltersFromSearchParams(searchParams);
    const merged: FilterState = {
      ...current,
      ...next,
      page: next.page ?? 1,
    };
    dispatch(setFilters(merged));
    const query = filtersToQuery(merged);
    router.push(query ? `/products?${query}` : "/products");
  };

  const removeChip = (key: string, value?: string) => {
    applyFilters(withFilterRemoved(parseFiltersFromSearchParams(searchParams), key, value));
  };

  return { filters, applyFilters, removeChip };
}
