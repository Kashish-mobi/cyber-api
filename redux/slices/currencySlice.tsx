import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Currency } from "@/lib/currency";

const STORAGE_KEY = "currency";

type CurrencyState = {
  currency: Currency;
};

export function loadCurrency(): Currency {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dollar" || saved === "rupee" || saved === "euro") {
    return saved;
  }
  return "dollar";
}

const initialState: CurrencyState = {
  currency: "dollar",
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
      localStorage.setItem(STORAGE_KEY, action.payload);
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
