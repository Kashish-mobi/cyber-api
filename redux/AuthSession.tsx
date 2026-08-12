"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { hydrateAuth, logout } from "./slices/userSlice";
import { clearAuthSession, loadAuthSession } from "@/lib/authSession";

export default function AuthSession() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const session = loadAuthSession();
    if (!session) return;

    if (Date.now() >= session.expiresAt) {
      clearAuthSession();
      dispatch(logout());
      return;
    }

    dispatch(hydrateAuth(session));
  }, [dispatch]);

  return null;
}
