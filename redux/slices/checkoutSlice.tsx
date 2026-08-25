import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Address = {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  type: "HOME" | "OFFICE";
};

type CheckoutState = {
  addresses: Address[];
  selectedAddressId: number | null;
  shippingMethodId: number;
  shippingDate: string;
  step: number;
};

const STORAGE_KEY = "checkoutAddresses";

const defaultAddresses: Address[] = [
  {
    id: 1,
    label: "2118 Thornridge",
    street: "2118 Thornridge Cir.",
    city: "Syracuse",
    state: "Connecticut",
    zip: "35624",
    phone: "(209) 555-0104",
    type: "HOME",
  },
  {
    id: 2,
    label: "Headoffice",
    street: "2715 Ash Dr.",
    city: "San Jose",
    state: "South Dakota",
    zip: "83475",
    phone: "(704) 555-0127",
    type: "OFFICE",
  },
];

export function formatAddress(address: Address) {
  return `${address.street} ${address.city}, ${address.state} ${address.zip}`;
}

function saveAddresses(addresses: Address[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

export function loadAddresses(): Address[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultAddresses;

  try {
    const parsed = JSON.parse(raw) as Address[];
    return parsed.length ? parsed : defaultAddresses;
  } catch {
    return defaultAddresses;
  }
}

const initialState: CheckoutState = {
  addresses: defaultAddresses,
  selectedAddressId: 1,
  shippingMethodId: 1,
  shippingDate: "",
  step: 1,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
      if (
        !state.addresses.find((item) => item.id === state.selectedAddressId)
      ) {
        state.selectedAddressId = state.addresses[0]?.id ?? null;
      }
    },
    selectAddress: (state, action: PayloadAction<number>) => {
      state.selectedAddressId = action.payload;
    },
    addAddress: (state, action: PayloadAction<Omit<Address, "id">>) => {
      const id = Date.now();
      state.addresses.push({ ...action.payload, id });
      state.selectedAddressId = id;
      saveAddresses(state.addresses);
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const index = state.addresses.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index >= 0) state.addresses[index] = action.payload;
      saveAddresses(state.addresses);
    },
    deleteAddress: (state, action: PayloadAction<number>) => {
      state.addresses = state.addresses.filter(
        (item) => item.id !== action.payload
      );
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = state.addresses[0]?.id ?? null;
      }
      saveAddresses(state.addresses);
    },
    setShippingMethod: (state, action: PayloadAction<number>) => {
      state.shippingMethodId = action.payload;
    },
    setShippingDate: (state, action: PayloadAction<string>) => {
      state.shippingDate = action.payload;
    },
    setStep: (state, action: PayloadAction<number>) => {
      const next = Math.round(action.payload);
      state.step = Number.isFinite(next) ? Math.min(3, Math.max(1, next)) : 1;
    },
  },
});

export const {
  setAddresses,
  selectAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setShippingMethod,
  setShippingDate,
  setStep,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
