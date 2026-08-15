import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WishlistState = {
  wishlist: number[];
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
};

const STORAGE_KEY = "wishlist";

export function loadWishlist(): number[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as number[];
  } catch {
    return [];
  }
}

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
  error: null,
  isInitialized: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrateWishlist: (state, action: PayloadAction<number[]>) => {
      state.wishlist = action.payload;
      state.isInitialized = true;
    },
    addToWishlist: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.wishlist.includes(id)) {
        state.wishlist.push(id);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.wishlist));
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.wishlist = state.wishlist.filter((id) => id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.wishlist));
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.wishlist));
    },
  },
});

export const {
  hydrateWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
