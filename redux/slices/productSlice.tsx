import { GetData } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  applyProductFilters,
  initialFilterState,
  type FilterState,
} from "./filterSlice";

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
};

type ProductState = {
  products: Product[];
  categories: string[];
  totalProducts: number;
  product: Product | null;

  currentPage: number;
  limit: number;

  loading: boolean;
  error: string | null;
};

function getSortQuery(sortBy: string) {
  if (sortBy === "rating-asc") return "sortBy=rating&order=asc";
  if (sortBy === "price-asc") return "sortBy=price&order=asc";
  if (sortBy === "price-desc") return "sortBy=price&order=desc";
  return "sortBy=rating&order=desc";
}

export const getCategories = createAsyncThunk(
  "products/getCategories",
  async () => {
    const response = await GetData("/products/category-list");
    return response;
  }
);

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (args?: Partial<FilterState> & { limit?: number }) => {
    const filters: FilterState = { ...initialFilterState, ...args };
    const page = filters.page;
    const limit = args?.limit ?? 12;
    const skip = (page - 1) * limit;
    const query = `limit=0&${getSortQuery(filters.sortBy)}`;

    const endpoint =
      filters.category === "all"
        ? `/products?${query}`
        : `/products/category/${encodeURIComponent(filters.category)}?${query}`;

    const response = await GetData(endpoint);
    const filtered = applyProductFilters(
      (response.products || []) as Product[],
      filters
    );

    return {
      products: filtered.slice(skip, skip + limit),
      total: filtered.length,
      page,
      limit,
      sortBy: filters.sortBy,
    };
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (
    args: Partial<FilterState> & { searchTerm?: string; limit?: number }
  ) => {
    const filters: FilterState = {
      ...initialFilterState,
      ...args,
      q: args.searchTerm || args.q || "",
    };
    const page = filters.page;
    const limit = args.limit ?? 12;
    const skip = (page - 1) * limit;
    const query = `q=${encodeURIComponent(filters.q)}&limit=0&${getSortQuery(filters.sortBy)}`;

    const response = await GetData(`/products/search?${query}`);
    const filtered = applyProductFilters(
      (response.products || []) as Product[],
      filters
    );

    return {
      products: filtered.slice(skip, skip + limit),
      total: filtered.length,
      page,
      limit,
      sortBy: filters.sortBy,
    };
  }
);

export const getProductsById = createAsyncThunk(
  "products/getProductsById",
  async (id: number) => {
    const response = await GetData(`/products/${id}`);
    return response;
  }
);

const initialState: ProductState = {
  products: [],
  categories: [],
  totalProducts: 0,
  product: null,

  currentPage: 1,
  limit: 12,

  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload || [];
    });
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.totalProducts = action.payload.total;
      state.currentPage = action.payload.page;
      state.limit = action.payload.limit;
    });

    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(searchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.totalProducts = action.payload.total;
      state.currentPage = action.payload.page;
      state.limit = action.payload.limit;
    });
    builder.addCase(searchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(getProductsById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductsById.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(getProductsById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default productSlice.reducer;