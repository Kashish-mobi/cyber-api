import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { PostData } from "@/api/api";
import {
  User,
  SignupPayload,
  LoginPayload,
} from "@/lib/types/user";

// Login expires after 1 hour
export const ONE_HOUR_MS = 60 * 60 * 1000;
const STORAGE_KEY = "login";

type SavedLogin = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

// Save login to browser after sign-in
export function saveLogin(data: SavedLogin) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600`;
}

// Remove login from browser
export function clearLogin() {
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = "accessToken=; path=/; max-age=0";
}

// Read saved login (used when page loads)
export function loadLogin(): SavedLogin | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SavedLogin;
  } catch {
    return null;
  }
}

type UserState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  refreshToken: string | null;
  expiresAt: number | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  refreshToken: null,
  expiresAt: null,
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk(
  "auth/signup",
  async (payload: SignupPayload) => {
    const response = await PostData("/users/add", {
      name: payload.name,
      email: payload.email,
      username: payload.email,
      password: payload.password,
    });

    return response;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload) => {
    const response = await PostData("/auth/login", {
      username: payload.username,
      password: payload.password,
      expiresInMins: 60,
    });

    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    restoreLogin: (state, action: PayloadAction<SavedLogin>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = {
        id: action.payload.id,
        name: `${action.payload.firstName} ${action.payload.lastName}`.trim(),
        email: action.payload.email,
        username: action.payload.username,
      };
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
    });

    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Signup failed";
    });

    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = {
        id: action.payload.id,
        name: `${action.payload.firstName} ${action.payload.lastName}`,
        email: action.payload.email,
        username: action.payload.username,
      };
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = Date.now() + ONE_HOUR_MS;
      state.isAuthenticated = true;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Login failed";
    });
  },
});

export const { restoreLogin, logout } = userSlice.actions;
export default userSlice.reducer;
