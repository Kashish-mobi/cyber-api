import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import loaderReducer from "./loaderSlice";
import productReducer from "./slices/productSlice";
import filterReducer from "./slices/filterSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import wishlistReducer from "./slices/wishlistSlice";
import currencyReducer from "./slices/currencySlice";
import cartUiReducer from "./slices/cartUiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    loader: loaderReducer,
    products: productReducer,
    filters: filterReducer,
    cart: cartReducer,
    cartUi: cartUiReducer,
    checkout: checkoutReducer,
    wishlist: wishlistReducer,
    currency: currencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;