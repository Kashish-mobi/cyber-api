"use client";

import { currencySign as makePrice, type Currency } from "@/lib/currency";
import { useDispatch, useSelector } from "@/redux/hooks";
import { setCurrency } from "@/redux/slices/currencySlice";

export function useCurrency() {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency.currency);

  return {
    currency,
    changeCurrency: (newCurrency: Currency) => dispatch(setCurrency(newCurrency)),
    currencySign: (price: number) => makePrice(price, currency),
  };
}
