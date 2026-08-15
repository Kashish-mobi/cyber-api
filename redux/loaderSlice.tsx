import { createSlice } from "@reduxjs/toolkit";

type LoaderState = {
  isLoading: boolean;
};

const initialState: LoaderState = {
  isLoading: false,
};

function isProductListAction(type: string) {
  return (
    type.startsWith("products/getProducts/") ||
    type.startsWith("products/searchProducts/")
  );
}

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    hideLoader: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") && !isProductListAction(action.type),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) =>
          (action.type.endsWith("/fulfilled") ||
            action.type.endsWith("/rejected")) &&
          !isProductListAction(action.type),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
