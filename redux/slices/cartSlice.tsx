import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  discountCode: string;
  bonusCardNumber: string;
};

const STORAGE_KEY = "cart";
const DETAILS_KEY = "checkoutDetails";

export function loadCart(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function loadCheckoutDetails() {
  const raw = localStorage.getItem(DETAILS_KEY);
  if (!raw) return { discountCode: "", bonusCardNumber: "" };

  try {
    return JSON.parse(raw) as {
      discountCode: string;
      bonusCardNumber: string;
    };
  } catch {
    return { discountCode: "", bonusCardNumber: "" };
  }
}

const initialState: CartState = {
  cart: [],
  discountCode: "",
  bonusCardNumber: "",
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    hydrateCart: (
      state,
      action: PayloadAction<CartItem[]>
    ) => {
      state.cart = action.payload;
    },

    addToCart: (
      state,
      action: PayloadAction<CartItem>
    ) => {
      const item = action.payload;

      const existing = state.cart.find(
        (p) => p.id === item.id
      );

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.cart.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.cart)
      );
    },

    removeFromCart: (
      state,
      action: PayloadAction<number>
    ) => {
      state.cart = state.cart.filter(
        (p) => p.id !== action.payload
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.cart)
      );
    },

    updateCartQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        quantity: number;
      }>
    ) => {
      const item = state.cart.find(
        (p) => p.id === action.payload.id
      );

      if (item) {
        item.quantity = Math.max(
          1,
          action.payload.quantity
        );
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.cart)
      );
    },

    setDiscountCode: (
      state,
      action: PayloadAction<string>
    ) => {
      state.discountCode = action.payload;
    },

    setBonusCardNumber: (
      state,
      action: PayloadAction<string>
    ) => {
      state.bonusCardNumber = action.payload;
    },

    setCheckoutDetails: (
      state,
      action: PayloadAction<{
        discountCode: string;
        bonusCardNumber: string;
      }>
    ) => {
      state.discountCode = action.payload.discountCode;
      state.bonusCardNumber = action.payload.bonusCardNumber;
      localStorage.setItem(
        DETAILS_KEY,
        JSON.stringify({
          discountCode: state.discountCode,
          bonusCardNumber: state.bonusCardNumber,
        })
      );
    },

    hydrateCheckoutDetails: (
      state,
      action: PayloadAction<{
        discountCode: string;
        bonusCardNumber: string;
      }>
    ) => {
      state.discountCode = action.payload.discountCode;
      state.bonusCardNumber = action.payload.bonusCardNumber;
    },

    clearCheckoutDetails: (state) => {
      state.discountCode = "";
      state.bonusCardNumber = "";
      localStorage.removeItem(DETAILS_KEY);
    },

    clearCart: (state) => {
      state.cart = [];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.cart)
      );
    },
  },
});

export const {
  hydrateCart,
  hydrateCheckoutDetails,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  setDiscountCode,
  setBonusCardNumber,
  setCheckoutDetails,
  clearCheckoutDetails,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;