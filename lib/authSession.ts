import type { User } from "@/lib/types/user";

export const LOGIN_EXPIRY_MINS = 60;
export const SESSION_DURATION_MS = LOGIN_EXPIRY_MINS * 60 * 1000;

const AUTH_STORAGE_KEY = "auth_session";

export type AuthSession = {
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number;
};

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  if (session.accessToken) {
    document.cookie = `accessToken=${session.accessToken}; path=/; max-age=${LOGIN_EXPIRY_MINS * 60}`;
  }
}

export function loadAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  document.cookie = "accessToken=; path=/; max-age=0";
}
