"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "./hooks";
import {
  clearLogin,
  loadLogin,
  logout,
  restoreLogin,
} from "./slices/userSlice";
import { setWishlist, loadWishlist } from "./slices/wishlistSlice";
import { setCurrency, loadCurrency } from "./slices/currencySlice";
import {
  setCart,
  setCodes,
  loadCart,
  loadCodes,
  clearCart,
} from "./slices/cartSlice";
import { setAddresses, loadAddresses } from "./slices/checkoutSlice";
import { loadCartItems, clearApiCart, clearCartCache } from "@/lib/cartApi";
import { store } from "./store";

function LoadSavedData() {
  const dispatch = useDispatch();
  const { isAuthenticated, expiresAt, user } = useSelector((state) => state.user);

  // "guest" or "user-1" — cart loads once when this changes
  const [authKey, setAuthKey] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setWishlist(loadWishlist()));
    dispatch(setCurrency(loadCurrency()));
    dispatch(setCart(loadCart()));
    dispatch(setCodes(loadCodes()));
    dispatch(setAddresses(loadAddresses()));
  }, [dispatch]);

  // First load: restore login, set authKey once
  useEffect(() => {
    const saved = loadLogin();

    if (saved && Date.now() < saved.expiresAt) {
      dispatch(restoreLogin(saved));
      setAuthKey(`user-${saved.user.id}`);
    } else {
      if (saved) {
        clearLogin();
        dispatch(logout());
      }
      setAuthKey("guest");
    }
  }, [dispatch]);

  // Login / logout after first load
  useEffect(() => {
    if (authKey === null) return;

    if (isAuthenticated && user?.id) {
      const next = `user-${user.id}`;
      if (next !== authKey) {
        clearCartCache();
        setAuthKey(next);
      }
      return;
    }

    if (!isAuthenticated && authKey !== "guest") {
      clearCartCache();
      setAuthKey("guest");
    }
  }, [isAuthenticated, user?.id, authKey]);

  // ONE cart API call whenever authKey changes
  useEffect(() => {
    if (!authKey) return;

    const key = authKey;

    async function loadOnce() {
      const userId = key.startsWith("user-")
        ? Number(key.replace("user-", ""))
        : 0;
      const { items } = await loadCartItems(userId);
      dispatch(setCart(items));
    }

    loadOnce();
  }, [authKey, dispatch]);

  // Auto logout after 1 hour
  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const logoutUser = () => {
      clearLogin();
      clearApiCart();
      dispatch(logout());
      dispatch(clearCart());
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
