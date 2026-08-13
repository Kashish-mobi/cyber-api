import { GetData } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  totalProducts: number;
  product: Product | null;
  loading: boolean;
  error: string | null;
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    const response = await GetData("/products");
    return response;
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (searchTerm: string) => {
    const response = await GetData(
      `/products/search?q=${encodeURIComponent(searchTerm)}`
    );
    return response;
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
  totalProducts: 0,
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.totalProducts = action.payload.total;
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