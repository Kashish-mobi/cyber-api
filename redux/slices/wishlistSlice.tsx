import { createSlice } from "@reduxjs/toolkit";
type WishlistState = {
    wishlist: number[];
    loading: boolean;
    error: string | null;
  };
  
  const initialState: WishlistState = {
    wishlist: [],
    loading: false,
    error: null,
  };

  const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
  });

  export default wishlistSlice.reducer;