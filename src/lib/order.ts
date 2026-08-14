import { PRICE_PAISE, USD_PRICE, COUPONS, type Currency } from "./constants";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateOrderNumber(): string {
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return `WW-${result}`;
}

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

/**
 * Convert paise to a display-only USD amount, rounded UP to the nearest whole
 * dollar (per the "round up to the highest dollar" requirement).
 */
export function usdDollars(paise: number): number {
  return Math.ceil((paise * USD_PRICE) / PRICE_PAISE);
}

export function formatUsdDollars(dollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}

export function formatUSD(paise: number): string {
  return formatUsdDollars(usdDollars(paise));
}

export function formatPrice(paise: number, currency: Currency): string {
  return currency === "USD" ? formatUSD(paise) : formatINR(paise);
}

/**
 * Compute order amounts from total quantity (sum of all cart items).
 * All items share the same unit price; the coupon applies to the total.
 */
export function computeOrderAmounts(totalQuantity: number, couponCode?: string | null) {
  const unitPricePaise = PRICE_PAISE;
  const subtotalPaise = unitPricePaise * totalQuantity;
  let discountPaise = 0;

  if (couponCode) {
    const coupon = COUPONS[couponCode.toUpperCase()];
    if (coupon && totalQuantity >= coupon.minQuantity) {
      discountPaise = Math.round(subtotalPaise * (coupon.discountPercent / 100));
    }
  }

  const totalPaise = subtotalPaise - discountPaise;
  return { unitPricePaise, subtotalPaise, discountPaise, totalPaise };
}

export function logStatus(currentLog: string | null, newStatus: string): string {
  const entries: string[] = currentLog ? JSON.parse(currentLog) : [];
  entries.push(newStatus);
  return JSON.stringify(entries);
}
