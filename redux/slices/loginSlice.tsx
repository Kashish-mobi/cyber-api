import { createSlice } from "@reduxjs/toolkit";
import { login, signUp } from "./userSlice";

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null as string | null,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state) => {
      state.loading = false;
      // DummyJSON /users/add does not return tokens
      state.isAuthenticated = false;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Signup failed";
    });

    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Login failed";
    });
  },
});

export default loginSlice.reducer;
