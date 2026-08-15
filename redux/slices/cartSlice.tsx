import { GetData, DeleteData, PutData } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// One product inside a cart (from DummyJSON)
type CartProduct = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
};

// One cart for a user
type Cart = {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};

type CartState = {
  carts: Cart[];
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  carts: [],
  loading: false,
  error: null,
};

// get cart 
export const getCartByUserId = createAsyncThunk(
  "cart/getCartByUserId",
  async (userId: number) => {
    const response = await GetData(`/carts/user/${userId}`);
    return response;
  }
);

// delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (itemId: number) => {
    const response = await DeleteData(`/carts/item/${itemId}`);
    return response;
  }
);

// update cart item
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (item: CartProduct) => {
    const response = await PutData(`/carts/item/${item.id}`, item);
    return response;
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCartByUserId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getCartByUserId.fulfilled, (state, action) => {
      state.loading = false;
      state.carts = action.payload.carts || [];
    });

    builder.addCase(getCartByUserId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });

    builder.addCase(deleteCartItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.carts = state.carts.filter((cart) => cart.id !== action.payload.id);
    });

    builder.addCase(deleteCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });

    builder.addCase(updateCartItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.carts = state.carts.map((cart) => cart.id === action.payload.id ? action.payload : cart);
    });

    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default cartSlice.reducer;
