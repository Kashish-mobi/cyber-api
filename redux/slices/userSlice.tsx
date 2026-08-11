import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PostData } from "@/api/api";
import {
  User,
  SignupPayload,
  LoginPayload,
} from "@/lib/types/user";

type UserState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  refreshToken: null,
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

// DummyJSON login expects username + password (not email)
export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload) => {
    const response = await PostData("/auth/login", {
      username: "emilys",
      password: "emilyspass",
      expiresInMins: 60,
    });

    return response;
  }
);

// user slice

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    // sign up

    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      // /users/add only simulates create — no tokens returned
      state.user = {
        id: action.payload.id,
        name: `${action.payload.firstName} ${action.payload.lastName}`.trim(),
        email: action.payload.email,
        username: action.payload.username,
      };
      state.isAuthenticated = true;
      state.accessToken = null;
      state.refreshToken = null;
    });

    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Signup failed";
    });

    // login

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

      state.accessToken =
        action.payload.accessToken;
      state.isAuthenticated = true;
      state.refreshToken =
        action.payload.refreshToken;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Login failed";
    });
  },
});

export default userSlice.reducer;