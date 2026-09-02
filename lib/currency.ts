export type Currency = "dollar" | "rupee" | "euro";

export const currencyOptions: Currency[] = ["dollar", "rupee", "euro"];

export const currencySymbols: Record<Currency, string> = {
  dollar: "$",
  rupee: "₹",
  euro: "€",
};

export function currencySign(price: number, currency: Currency) {
  if (currency === "rupee") {
    return "₹" + (price * 83).toFixed(2);
  }

  if (currency === "euro") {
    return "€" + (price * 0.92).toFixed(2);
  }

  return "$" + price.toFixed(2);
}
