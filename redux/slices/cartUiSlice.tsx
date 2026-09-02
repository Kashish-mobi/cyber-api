import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PendingCartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity?: number;
};

type CartUiView = "cart" | "login" | "added";

type CartUiState = {
  open: boolean;
  view: CartUiView;
  pendingItem: PendingCartItem | null;
};

const initialState: CartUiState = {
  open: false,
  view: "cart",
  pendingItem: null,
};

const cartUiSlice = createSlice({
  name: "cartUi",
  initialState,
  reducers: {
    toggleCartDropdown: (state) => {
      if (state.open) {
        state.open = false;
        state.view = "cart";
        state.pendingItem = null;
      } else {
        state.open = true;
        state.view = "cart";
      }
    },
    openCartDropdown: (state, action: PayloadAction<CartUiView | undefined>) => {
      state.open = true;
      state.view = action.payload ?? "cart";
    },
    closeCartDropdown: (state) => {
      state.open = false;
      state.view = "cart";
      state.pendingItem = null;
    },
    showLoginForCart: (state, action: PayloadAction<PendingCartItem>) => {
      state.open = true;
      state.view = "login";
      state.pendingItem = action.payload;
    },
    showAddedToCart: (state) => {
      state.open = true;
      state.view = "added";
      state.pendingItem = null;
    },
    clearPendingItem: (state) => {
      state.pendingItem = null;
    },
  },
});

export const {
  toggleCartDropdown,
  openCartDropdown,
  closeCartDropdown,
  showLoginForCart,
  showAddedToCart,
  clearPendingItem,
} = cartUiSlice.actions;

export default cartUiSlice.reducer;
