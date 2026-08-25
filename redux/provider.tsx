"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "./hooks";
import {
  clearLogin,
  loadLogin,
  logout,
  restoreLogin,
} from "./slices/userSlice";
import { setWishlist, loadWishlist } from "./slices/wishlistSlice";
import { setCart, setCodes, loadCart, loadCodes } from "./slices/cartSlice";
import { setAddresses, loadAddresses } from "./slices/checkoutSlice";
import { store } from "./store";

function LoadSavedData() {
  const dispatch = useDispatch();
  const { isAuthenticated, expiresAt } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(setWishlist(loadWishlist()));
    dispatch(setCart(loadCart()));
    dispatch(setCodes(loadCodes()));
    dispatch(setAddresses(loadAddresses()));
  }, [dispatch]);

  // When page loads, restore login from localStorage
  useEffect(() => {
    const saved = loadLogin();
    if (!saved) return;

    if (Date.now() >= saved.expiresAt) {
      clearLogin();
      dispatch(logout());
      return;
    }

    dispatch(restoreLogin(saved));
  }, [dispatch]);

  // Auto logout after 1 hour
  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const logoutUser = () => {
      clearLogin();
      dispatch(logout());
    };

    const timeLeft = expiresAt - Date.now();
    if (timeLeft <= 0) {
      logoutUser();
      return;
    }

    const timer = setTimeout(logoutUser, timeLeft);
    return () => clearTimeout(timer);
  }, [isAuthenticated, expiresAt, dispatch]);

  return null;
}

type ReduxProviderProps = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <LoadSavedData />
      {children}
    </Provider>
  );
}
