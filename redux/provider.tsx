"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  clearLogin,
  loadLogin,
  logout,
  restoreLogin,
} from "./slices/userSlice";
import { hydrateWishlist, loadWishlist } from "./slices/wishlistSlice";
import { hydrateCart, loadCart } from "./slices/cartSlice";
import { store } from "./store";

function LoginSession() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, expiresAt } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(hydrateWishlist(loadWishlist()));
    dispatch(hydrateCart(loadCart()));
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
      <LoginSession />
      {children}
    </Provider>
  );
}
