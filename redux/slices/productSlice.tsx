import { getData } from "@/api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  defaultFilters,
  filterProducts,
  filtersToString,
  PAGE_SIZE,
  type Filters,
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
  filter: string;
  currentPage: number;
  limit: number;
  filtered: boolean;
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
    const response = await getData("/products/category-list");
    return response;
  }
);

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (args?: Partial<Filters> & { limit?: number }) => {
    const filters: Filters = { ...defaultFilters, ...args };
    const page = filters.page;
    const limit = args?.limit ?? PAGE_SIZE;
    const skip = (page - 1) * limit;
    const query = `limit=0&${getSortQuery(filters.sortBy)}`;

    const endpoint =
      filters.category === "all"
        ? `/products?${query}`
        : `/products/category/${encodeURIComponent(filters.category)}?${query}`;

    const response = await getData(endpoint);
    const list = filterProducts(
      (response.products || []) as Product[],
      filters
    );

    return {
      products: list.slice(skip, skip + limit),
      total: list.length,
      page,
      limit,
      sortBy: filters.sortBy,
      filter: filtersToString(filters),
    };
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (args: Partial<Filters> & { limit?: number }) => {
    const filters: Filters = { ...defaultFilters, ...args };
    const page = filters.page;
    const limit = args.limit ?? PAGE_SIZE;
    const skip = (page - 1) * limit;
    const query = `q=${encodeURIComponent(filters.q)}&limit=0&${getSortQuery(filters.sortBy)}`;

    const response = await getData(`/products/search?${query}`);
    const list = filterProducts(
      (response.products || []) as Product[],
      filters
    );

    return {
      products: list.slice(skip, skip + limit),
      total: list.length,
      page,
      limit,
      sortBy: filters.sortBy,
      filter: filtersToString(filters),
    };
  }
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id: number) => {
    const response = await getData(`/products/${id}`);
    return response;
  }
);

const initialState: ProductState = {
  products: [],
  categories: [],
  totalProducts: 0,
  product: null,
  filter: "",
  currentPage: 1,
  limit: PAGE_SIZE,
  filtered: false,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFiltered: (state, action: PayloadAction<boolean>) => {
      state.filtered = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = Array.isArray(action.payload) ? action.payload : [];
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
      state.filter = action.payload.filter;
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
      state.filter = action.payload.filter;
    });
    builder.addCase(searchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(getProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(getProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export const { setFiltered } = productSlice.actions;

export default productSlice.reducer;
